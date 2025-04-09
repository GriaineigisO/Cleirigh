import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS options
const corsOptions = {
  origin: "https://cleirighgenealogy.com",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(", ")
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, idNumber } = req.body;
    const id = idNumber;

    // Get the current tree ID from the user's record
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: "Error retrieving user data" });
    }

    const currentTree = user.current_tree_id;

    // Fetch all rows from the tree_{currentTree} table
    let allData = [];
    let from = 0;
    let to = 999;
    let done = false;

    while (!done) {
      const { data, error } = await supabase
        .from(`tree_${currentTree}`)
        .select("ancestor_id, father_id, mother_id")
        .range(from, to);

      if (error) {
        return res.status(500).json({ error: "Error fetching tree data" });
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += 1000;
        to += 1000;
      } else {
        done = true;
      }
    }

    // Create a lookup map from allData for faster access
    const ancestorLookup = allData.reduce((acc, ancestor) => {
      acc[ancestor.ancestor_id] = ancestor;
      return acc;
    }, {});

    // Memoization cache to store already calculated coefficients
    const memo = {};

    /**
     * Recursive function to calculate inbreeding coefficient
     * @param {number} personId - ID of the person to calculate coefficient for
     * @param {object[]} path - Array of ancestor IDs in the current path (for detecting loops)
     * @returns {number} Inbreeding coefficient (0 to 1)
     */
    function calculateInbreedingCoefficient(personId, path = []) {
      // Check memoization cache first
      if (memo[personId] !== undefined) {
        return memo[personId];
      }

      const person = ancestorLookup[personId];

      // If person doesn't exist in the tree, return 0
      if (!person) {
        memo[personId] = 0;
        return 0;
      }

      // Check for parent loops
      if (path.includes(personId)) {
        memo[personId] = 0;
        return 0;
      }

      // If person has no parents, return 0
      if (!person.father_id && !person.mother_id) {
        memo[personId] = 0;
        return 0;
      }

      let commonCoEff = 0;

      if (person.father_id && person.mother_id) {
        const commonAncestors = findCommonAncestors(
          person.father_id,
          person.mother_id
        );

        for (const {
          ancestorId,
          fatherSteps,
          motherSteps,
        } of commonAncestors) {
          const n = fatherSteps + motherSteps; // Total generational distance
          const F_CA = calculateInbreedingCoefficient(ancestorId, [
            ...path,
            personId,
          ]);
          commonCoEff += Math.pow(0.5, n + 1) * (1 + F_CA);
        }
      }

      // Calculate parents' coefficients (for father and mother)
      const fatherCoEff = person.father_id
        ? calculateInbreedingCoefficient(person.father_id, [...path, personId])
        : 0;

      const motherCoEff = person.mother_id
        ? calculateInbreedingCoefficient(person.mother_id, [...path, personId])
        : 0;

      // Total coefficient: ensure no overcounting of common ancestors
      const totalCoEff = commonCoEff + fatherCoEff / 2 + motherCoEff / 2;

      memo[personId] = totalCoEff;
      return totalCoEff;
    }

    function findCommonAncestors(fatherId, motherId) {
      console.log(
        `Finding common ancestors between ${fatherId} and ${motherId}`
      );

      const ancestors1 = getAllAncestorsWithDistances(fatherId);
      const ancestors2 = getAllAncestorsWithDistances(motherId);

      const common = [];
      for (const [ancestorId, dist1] of Object.entries(ancestors1)) {
        if (ancestors2[ancestorId]) {
          const dist2 = ancestors2[ancestorId];
          common.push({
            ancestorId: Number(ancestorId),
            fatherSteps: dist1,
            motherSteps: dist2,
          });
        }
      }

      console.log("Common ancestors:", common);
      return common;
    }

    function getAllAncestorsWithDistances(personId, distance = 1) {
      const person = ancestorLookup[personId];
      if (!person) return {};

      const result = {};

      if (person.father_id) {
        const fatherAncestors = getAllAncestorsWithDistances(
          person.father_id,
          distance + 1
        );
        Object.assign(result, fatherAncestors);
      }

      if (person.mother_id) {
        const motherAncestors = getAllAncestorsWithDistances(
          person.mother_id,
          distance + 1
        );
        Object.assign(result, motherAncestors);
      }

      result[personId] = distance;

      return result;
    }

    // Calculate the inbreeding coefficient for the requested person
    const coefficient = calculateInbreedingCoefficient(id);
    console.log(`Inbreeding coefficient for ${id}:`, coefficient);

    /**
     * Provides a human-readable interpretation of the inbreeding coefficient
     * @param {number} coefficient - Inbreeding coefficient percentage
     * @returns {string} Interpretation text
     */
    function getInterpretation(coefficient) {
      if (coefficient === 0) return "No detectable inbreeding";
      if (coefficient < 0.1)
        return "Very distant relatives (e.g., 6th cousins or more)";
      if (coefficient < 0.5) return "Distant relatives (e.g., 4th-5th cousins)";
      if (coefficient < 1) return "3rd-4th cousins";
      if (coefficient < 2) return "2nd-3rd cousins";
      if (coefficient < 6) return "1st-2nd cousins";
      if (coefficient < 13) return "Siblings or parent-child";
      if (coefficient < 25) return "Double first cousins or uncle-niece";
      return "Very close relationship (e.g., sibling or parent-child repeated)";
    }

    // Return the calculated inbreeding coefficient as a percentage
    res.json({
      inbreedingCoefficient: coefficient * 100,
      interpretation: getInterpretation(coefficient * 100),
    });
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
