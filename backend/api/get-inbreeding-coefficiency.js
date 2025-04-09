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

      // Check for parent loops (shouldn't happen in valid genealogy)
      if (path.includes(personId)) {
        // Circular reference detected
        memo[personId] = 0;
        return 0;
      }

      // If person has no parents, return 0 (base case)
      if (!person.father_id && !person.mother_id) {
        memo[personId] = 0;
        return 0;
      }

      if (person.father_id && person.mother_id) {
        const commonAncestors = findCommonAncestors(person.father_id, person.mother_id);
        
        for (const {ancestorId, fatherSteps, motherSteps} of commonAncestors) {
          const n = fatherSteps + motherSteps;
          const F_CA = calculateInbreedingCoefficient(ancestorId);
          commonCoEff += Math.pow(0.5, n + 1) * (1 + F_CA);
        }
      }

      // Calculate inbreeding coefficients for parents (even if only one parent exists)
      const fatherCoEff = person.father_id 
        ? calculateInbreedingCoefficient(person.father_id, [...path, personId])
        : 0;
      
      const motherCoEff = person.mother_id 
        ? calculateInbreedingCoefficient(person.mother_id, [...path, personId])
        : 0;

      // Only calculate common ancestors if both parents exist
      let commonCoEff = 0;
      if (person.father_id && person.mother_id) {
        // Find all paths between parents to identify common ancestors
        const fatherAncestors = getAllAncestors(person.father_id);
        const motherAncestors = getAllAncestors(person.mother_id);
        
        // Find common ancestors between parents
        const commonAncestors = fatherAncestors.filter(ancestor => 
          motherAncestors.includes(ancestor)
        );

        for (const caId of commonAncestors) {
          // Get all paths from father to common ancestor
          const fatherPaths = getAllPaths(person.father_id, caId);
          // Get all paths from mother to common ancestor
          const motherPaths = getAllPaths(person.mother_id, caId);

          for (const fatherPath of fatherPaths) {
            for (const motherPath of motherPaths) {
              const n1 = fatherPath.length;
              const n2 = motherPath.length;
              const F_CA = calculateInbreedingCoefficient(caId, [...path, personId]);
              commonCoEff += Math.pow(0.5, n1 + n2 + 1) * (1 + F_CA);
            }
          }
        }
      }

      // Total inbreeding coefficient
      const totalCoEff = commonCoEff + (fatherCoEff / 2) + (motherCoEff / 2);
      
      // Memoize the result
      memo[personId] = totalCoEff;
      return totalCoEff;
    }

    function findCommonAncestors(personId1, personId2) {
        const ancestors1 = getAncestorSteps(personId1);
        const ancestors2 = getAncestorSteps(personId2);
        
        const common = [];
        
        for (const [ancestorId, steps] of Object.entries(ancestors1)) {
          if (ancestors2[ancestorId]) {
            for (const s1 of steps) {
              for (const s2 of ancestors2[ancestorId]) {
                common.push({
                  ancestorId: Number(ancestorId),
                  fatherSteps: s1,
                  motherSteps: s2
                });
              }
            }
          }
        }
        
        return common;
      }

      function getAncestorSteps(personId, steps = 0) {
        const person = ancestorLookup[personId];
        if (!person) return {};
        
        const result = {};
        
        if (person.father_id) {
          const fatherAncestors = getAncestorSteps(person.father_id, steps + 1);
          Object.assign(result, fatherAncestors);
        }
        
        if (person.mother_id) {
          const motherAncestors = getAncestorSteps(person.mother_id, steps + 1);
          Object.assign(result, motherAncestors);
        }
        
        if (!person.father_id && !person.mother_id) {
          result[personId] = [steps];
        }
        
        return result;
      }

    /**
     * Recursive function to get all ancestors of a person
     * @param {number} personId - ID of the person
     * @returns {number[]} Array of ancestor IDs
     */
    function getAllAncestors(personId) {
      const person = ancestorLookup[personId];
      if (!person) return [];

      const ancestors = new Set();
      
      if (person.father_id) {
        ancestors.add(person.father_id);
        const fatherAncestors = getAllAncestors(person.father_id);
        fatherAncestors.forEach(a => ancestors.add(a));
      }

      if (person.mother_id) {
        ancestors.add(person.mother_id);
        const motherAncestors = getAllAncestors(person.mother_id);
        motherAncestors.forEach(a => ancestors.add(a));
      }

      return Array.from(ancestors);
    }

    /**
     * Recursive function to find all paths from descendant to ancestor
     * @param {number} descendantId - Starting person ID
     * @param {number} ancestorId - Target ancestor ID
     * @param {number[]} currentPath - Current path being explored
     * @returns {number[][]} Array of paths (each path is an array of IDs)
     */
    function getAllPaths(descendantId, ancestorId, currentPath = []) {
      if (descendantId === ancestorId) {
        return [[...currentPath, descendantId]];
      }

      const person = ancestorLookup[descendantId];
      if (!person) return [];

      let allPaths = [];
      
      // Check father's line
      if (person.father_id) {
        const fatherPaths = getAllPaths(
          person.father_id, 
          ancestorId, 
          [...currentPath, descendantId]
        );
        allPaths = allPaths.concat(fatherPaths);
      }

      // Check mother's line
      if (person.mother_id) {
        const motherPaths = getAllPaths(
          person.mother_id, 
          ancestorId, 
          [...currentPath, descendantId]
        );
        allPaths = allPaths.concat(motherPaths);
      }

      return allPaths;
    }

    // Calculate the inbreeding coefficient for the requested person
    const coefficient = calculateInbreedingCoefficient(id);

    // Return the calculated inbreeding coefficient as a percentage
    res.json({ 
      inbreedingCoefficient: coefficient * 100,
      interpretation: getInterpretation(coefficient * 100)
    });
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Provides a human-readable interpretation of the inbreeding coefficient
 * @param {number} coefficient - Inbreeding coefficient percentage
 * @returns {string} Interpretation text
 */
function getInterpretation(coefficient) {
  if (coefficient === 0) return "No detectable inbreeding";
  if (coefficient < 0.1) return "Very distant relatives (e.g., 6th cousins or more)";
  if (coefficient < 0.5) return "Distant relatives (e.g., 4th-5th cousins)";
  if (coefficient < 1) return "3rd-4th cousins";
  if (coefficient < 2) return "2nd-3rd cousins";
  if (coefficient < 6) return "1st-2nd cousins";
  if (coefficient < 13) return "Siblings or parent-child";
  if (coefficient < 25) return "Double first cousins or uncle-niece";
  return "Very close relationship (e.g., sibling or parent-child repeated)";
}