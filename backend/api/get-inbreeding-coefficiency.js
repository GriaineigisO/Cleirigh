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

    function calculateInbreedingCoefficient(ancestorId, ancestorLookup) {
        const memo = new Map(); // For caching the inbreeding coefficient of ancestors
      
        function getF(id) {
          if (!id || !ancestorLookup[id]) {
            return 0; // If no ancestor exists, return 0 (no inbreeding)
          }
          if (memo.has(id)) {
            return memo.get(id); // Return cached value if already calculated
          }
      
          const { father_id, mother_id } = ancestorLookup[id];
      
          if (!father_id && !mother_id) {
            memo.set(id, 0);
            return 0; // If no parents, return 0 inbreeding coefficient
          }
      
          let F = 0;
      
          // If both father and mother exist, calculate recursively for both
          if (father_id && mother_id) {
            const fatherCoeff = getF(father_id); // Inbreeding from the father's side
            const motherCoeff = getF(mother_id); // Inbreeding from the mother's side
      
            // For each common ancestor between the parents, we calculate the coefficient
            const commonAncestors = findCommonAncestors(father_id, mother_id, ancestorLookup);
      
            // Sum the inbreeding coefficient from common ancestors
            for (const ca of commonAncestors) {
              const pathsToFather = getPaths(ca, father_id, ancestorLookup);
              const pathsToMother = getPaths(ca, mother_id, ancestorLookup);
      
              // For each path from father and mother to the common ancestor, calculate the coefficient
              for (const pf of pathsToFather) {
                for (const pm of pathsToMother) {
                  const n1 = pf.length; // Generations to father
                  const n2 = pm.length; // Generations to mother
                  const Fca = getF(ca); // Inbreeding coefficient for common ancestor
                  F += Math.pow(0.5, n1 + n2 + 1) * (1 + Fca);
                }
              }
            }
      
            // Halve the inbreeding coefficients from both parents
            F += 0.5 * (fatherCoeff + motherCoeff);
          } else if (father_id) {
            // Only the father exists, calculate inbreeding based on the father's side
            F += 0.5 * getF(father_id);
          } else if (mother_id) {
            // Only the mother exists, calculate inbreeding based on the mother's side
            F += 0.5 * getF(mother_id);
          }
      
          memo.set(id, F); // Store the result for future calls
          return F;
        }
      
        // Start the recursion from the given ancestorId
        return getF(ancestorId);
      }
      
      // Helper function to find common ancestors between two individuals
      function findCommonAncestors(fatherId, motherId, ancestorLookup) {
        const fatherAncestors = getAncestors(fatherId, ancestorLookup);
        const motherAncestors = getAncestors(motherId, ancestorLookup);
      
        // Return common ancestors by finding intersection of father and mother's ancestors
        return fatherAncestors.filter(ancestor => motherAncestors.includes(ancestor));
      }
      
      // Helper function to retrieve all ancestors of a given individual
      function getAncestors(id, ancestorLookup) {
        let ancestors = [];
        let current = id;
      
        // Traverse upwards through the ancestry
        while (current) {
          const ancestor = ancestorLookup[current];
          if (ancestor) {
            ancestors.push(current);
            current = ancestor.father_id || ancestor.mother_id; // Move up to the father or mother
          } else {
            break; // Stop if there's no more ancestor data
          }
        }
      
        return ancestors;
      }
      
      // Helper function to get all paths from an individual to a common ancestor
      function getPaths(ancestorId, startId, ancestorLookup) {
        let paths = [];
        let current = startId;
        
        // Traverse upwards through the ancestry and find the path
        while (current) {
          const ancestor = ancestorLookup[current];
          if (ancestor) {
            if (ancestorId === current) {
              paths.push([ancestorId]);
            }
            current = ancestor.father_id || ancestor.mother_id;
          } else {
            break; // Stop if there's no more ancestor data
          }
        }
        
        return paths;
      }
      
      

    const inbreedingCoefficient = calculateInbreedingCoefficient(
      id,
      ancestorLookup
    );

    console.log("inbreedingCoefficient:", inbreedingCoefficient);

    // Return the calculated inbreeding coefficient
    res.json(inbreedingCoefficient);
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
