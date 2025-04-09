import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
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
      
      // If person doesn't exist in the tree or has no parents, return 0
      if (!person || (!person.father_id && !person.mother_id)) {
        memo[personId] = 0;
        return 0;
      }

      // If person has only one parent, treat as no parents (can't be inbred with one parent)
      if (!person.father_id || !person.mother_id) {
        memo[personId] = 0;
        return 0;
      }

      // Check for parent loops (shouldn't happen in valid genealogy)
      if (path.includes(personId)) {
        // Circular reference detected
        memo[personId] = 0;
        return 0;
      }

      // Get all ancestors of both parents
      const fatherAncestors = getAllAncestors(person.father_id, []);
      const motherAncestors = getAllAncestors(person.mother_id, []);

      // Find common ancestors between parents
      const commonAncestors = fatherAncestors.filter(ancestor => 
        motherAncestors.includes(ancestor)
      );

      // Calculate the sum of (0.5)^(n1 + n2 + 1) * (1 + F_CA) for each common ancestor
      let commonCoEff = 0;
      
      for (const caId of commonAncestors) {
        // Get paths from father and mother to the common ancestor
        const fatherPath = getPathToAncestor(person.father_id, caId);
        const motherPath = getPathToAncestor(person.mother_id, caId);
        
        if (fatherPath && motherPath) {
          const n1 = fatherPath.length;
          const n2 = motherPath.length;
          const F_CA = calculateInbreedingCoefficient(caId, [...path, personId]);
          commonCoEff += Math.pow(0.5, n1 + n2 + 1) * (1 + F_CA);
        }
      }

      // Calculate inbreeding coefficients for parents
      const fatherCoEff = calculateInbreedingCoefficient(person.father_id, [...path, personId]);
      const motherCoEff = calculateInbreedingCoefficient(person.mother_id, [...path, personId]);

      // Total inbreeding coefficient
      const totalCoEff = commonCoEff + (fatherCoEff / 2) + (motherCoEff / 2);
      
      // Memoize the result
      memo[personId] = totalCoEff;
      return totalCoEff;
    }

    /**
     * Recursive function to get all ancestors of a person
     * @param {number} personId - ID of the person
     * @param {number[]} ancestors - Accumulator array of ancestor IDs
     * @returns {number[]} Array of ancestor IDs
     */
    function getAllAncestors(personId, ancestors) {
      const person = ancestorLookup[personId];
      if (!person) return ancestors;

      if (person.father_id) {
        if (!ancestors.includes(person.father_id)) {
          ancestors.push(person.father_id);
          getAllAncestors(person.father_id, ancestors);
        }
      }

      if (person.mother_id) {
        if (!ancestors.includes(person.mother_id)) {
          ancestors.push(person.mother_id);
          getAllAncestors(person.mother_id, ancestors);
        }
      }

      return ancestors;
    }

    /**
     * Recursive function to find path from descendant to ancestor
     * @param {number} descendantId - Starting person ID
     * @param {number} ancestorId - Target ancestor ID
     * @param {number[]} currentPath - Current path being explored
     * @returns {number[]|null} Array of IDs representing the path or null if not found
     */
    function getPathToAncestor(descendantId, ancestorId, currentPath = []) {
      if (descendantId === ancestorId) {
        return [...currentPath, descendantId];
      }

      const person = ancestorLookup[descendantId];
      if (!person) return null;

      // Check father's line
      if (person.father_id) {
        const fatherPath = getPathToAncestor(person.father_id, ancestorId, [...currentPath, descendantId]);
        if (fatherPath) return fatherPath;
      }

      // Check mother's line
      if (person.mother_id) {
        const motherPath = getPathToAncestor(person.mother_id, ancestorId, [...currentPath, descendantId]);
        if (motherPath) return motherPath;
      }

      return null;
    }

    // Calculate the inbreeding coefficient for the requested person
    const coefficient = calculateInbreedingCoefficient(id);

    // Return the calculated inbreeding coefficient as a percentage
    res.json({ inbreedingCoefficient: coefficient * 100 });
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}