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
    // Memoization cache for inbreeding coefficients
    const memo = {};

    // Simplified recursive function to calculate inbreeding coefficient
    function calculateInbreedingCoefficient(personId, path = []) {
      // Check memoization cache
      if (memo[personId] !== undefined) {
        return memo[personId];
      }

      // Find the person in the lookup table
      const person = ancestorLookup[personId];

      // If person doesn't exist or is at a leaf node, return 0 (base case)
      if (!person || (!person.father_id && !person.mother_id)) {
        memo[personId] = 0;
        return 0;
      }

      // Avoid circular references (if we're going through the same person in the path)
      if (path.includes(personId)) {
        memo[personId] = 0;
        return 0;
      }

      // Track the path of ancestors
      path.push(personId);

      let commonCoEff = 0;

      if (person.father_id && person.mother_id) {
        // Find common ancestors for father and mother
        const commonAncestors = findCommonAncestors(
          person.father_id,
          person.mother_id
        );

        // Loop through common ancestors and calculate the inbreeding coefficient
        commonAncestors.forEach(({ ancestorId, fatherSteps, motherSteps }) => {
          // The number of steps is how far each person is from the common ancestor
          const n = fatherSteps + motherSteps;

          // Log for debugging purposes
          console.log("Common Ancestor:", ancestorId);
          console.log("fatherSteps:", fatherSteps);
          console.log("motherSteps:", motherSteps);

          // Calculate F_CA (inbreeding coefficient for common ancestor)
          const F_CA = calculateInbreedingCoefficient(ancestorId, [
            ...path,
            personId,
          ]);

          // Accumulate the inbreeding coefficient for common ancestors
          commonCoEff += Math.pow(0.5, n) * (1 + F_CA); // Formula to calculate inbreeding coefficient
        });
      }

      // Calculate inbreeding coefficient from father and mother side
      const fatherCoEff = person.father_id
        ? calculateInbreedingCoefficient(person.father_id, [...path, personId])
        : 0;

      const motherCoEff = person.mother_id
        ? calculateInbreedingCoefficient(person.mother_id, [...path, personId])
        : 0;

      // Total inbreeding coefficient is the sum of common ancestors and individual parents' coefficients
      const totalCoEff = commonCoEff + (fatherCoEff + motherCoEff) / 2;

      // Memoize the result for this person
      memo[personId] = totalCoEff;

      return totalCoEff;
    }

    // Function to find common ancestors between two individuals (father_id and mother_id)
    function findCommonAncestors(fatherId, motherId) {
      const fatherAncestors = getAncestorSteps(fatherId);
      const motherAncestors = getAncestorSteps(motherId);

      const commonAncestors = [];

      // Iterate over the ancestors of father and mother and find common ancestors
      for (const [ancestorId, fatherSteps] of Object.entries(fatherAncestors)) {
        if (motherAncestors[ancestorId]) {
          const motherSteps = motherAncestors[ancestorId];
          commonAncestors.push({
            ancestorId: Number(ancestorId),
            fatherSteps,
            motherSteps,
          });
        }
      }

      return commonAncestors;
    }

    // Function to get all ancestors and their generation distances
    function getAncestorSteps(personId, steps = 0) {
      const person = ancestorLookup[personId];
      if (!person) return {};

      let result = {};

      // Get ancestors from father side
      if (person.father_id) {
        const fatherAncestors = getAncestorSteps(person.father_id, steps + 1);
        Object.assign(result, fatherAncestors);
      }

      // Get ancestors from mother side
      if (person.mother_id) {
        const motherAncestors = getAncestorSteps(person.mother_id, steps + 1);
        Object.assign(result, motherAncestors);
      }

      if (!person.father_id && !person.mother_id) {
        result[personId] = [steps];
      }

      return result;
    }

    const inbreedingCoeff = calculateInbreedingCoefficient(1, []);
    console.log(
      `Inbreeding coefficient for person 1: ${inbreedingCoeff * 100}%`
    );

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
