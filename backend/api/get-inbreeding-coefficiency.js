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
        const person = ancestorLookup[personId];
      
        // Check for existence of person in the tree
        if (!person) {
          return 0;
        }
      
        // Check for loops
        if (path.includes(personId)) {
          return 0;
        }
      
        // If there are no parents, return 0 (person is a dead end)
        if (!person.father_id && !person.mother_id) {
          return 0;
        }
      
        // Initialize the common coefficient
        let commonCoEff = 0;
      
        // Find common ancestors if both parents exist
        if (person.father_id && person.mother_id) {
          const commonAncestors = findCommonAncestors(person.father_id, person.mother_id);
      
          // For each common ancestor, calculate the inbreeding coefficient
          for (const { ancestorId, fatherSteps, motherSteps } of commonAncestors) {
            const n = fatherSteps + motherSteps;  // Total steps (generations) from the common ancestor to the person
            const F_CA = calculateInbreedingCoefficient(ancestorId, [...path, personId]);
            console.log("F_CA:", F_CA)
      
            // Add the common ancestor's contribution to the inbreeding coefficient
            commonCoEff += Math.pow(0.5, n) * (1 + F_CA);
          }
        }
      
        // Calculate the inbreeding coefficient from the parents
        const fatherCoEff = person.father_id
          ? calculateInbreedingCoefficient(person.father_id, [...path, personId])
          : 0;
        
        const motherCoEff = person.mother_id
          ? calculateInbreedingCoefficient(person.mother_id, [...path, personId])
          : 0;
      
        // Total coefficient, without overcounting common ancestors
        const totalCoEff = commonCoEff + (fatherCoEff / 2) + (motherCoEff / 2);
      
        return totalCoEff;
      }
      
      function findCommonAncestors(personId1, personId2) {
        const ancestors1 = getAncestorSteps(personId1);
        const ancestors2 = getAncestorSteps(personId2);
      
        const commonAncestors = [];
      
        // Check for common ancestors between both individuals
        for (const [ancestorId, steps1] of Object.entries(ancestors1)) {
          if (ancestors2[ancestorId]) {
            const steps2 = ancestors2[ancestorId];
            // For each common ancestor, calculate the relationship (steps)
            for (const s1 of steps1) {
              for (const s2 of steps2) {
                commonAncestors.push({
                  ancestorId: Number(ancestorId),
                  fatherSteps: s1,
                  motherSteps: s2,
                });
              }
            }
          }
        }
      
        return commonAncestors;
      }
      
      function getAncestorSteps(personId) {
        const person = ancestorLookup[personId];
        if (!person) return {};
      
        const result = {};
      
        if (person.father_id) {
          const fatherAncestors = getAncestorSteps(person.father_id);
          Object.assign(result, fatherAncestors);
        }
      
        if (person.mother_id) {
          const motherAncestors = getAncestorSteps(person.mother_id);
          Object.assign(result, motherAncestors);
        }
      
        if (!person.father_id && !person.mother_id) {
          result[personId] = [0]; // Dead end, no parents
        }
      
        return result;
      }
      
      const coefficient = calculateInbreedingCoefficient(personId);
      console.log(`Inbreeding Coefficient: ${result * 100}%`);


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
