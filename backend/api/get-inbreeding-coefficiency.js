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

    function calculateInbreedingCoefficientForAncestor(ancestorId, ancestorMap) {
        // Check if the ancestor data is available in the map
        if (!ancestorMap[ancestorId]) return 0;
      
        const ancestor = ancestorMap[ancestorId];
        const { father_id, mother_id } = ancestor;
      
        // If no further ancestors, return base case: 0 (no inbreeding from this ancestor)
        if (!father_id && !mother_id) return 0;
      
        // Recursively calculate the inbreeding coefficients for the parents
        const fatherCoeff = calculateInbreedingCoefficientForAncestor(father_id, ancestorMap);
        const motherCoeff = calculateInbreedingCoefficientForAncestor(mother_id, ancestorMap);
      
        // The inbreeding coefficient of the ancestor is the average of the parent's coefficients (halved)
        const inbreedingCoefficient = (fatherCoeff + motherCoeff) / 2;
      
        return inbreedingCoefficient;
      }
      
      // Recursive function to calculate the child's inbreeding coefficient
      function calculateChildInbreedingCoefficient(id, ancestorMap) {
        //find parents' ids
        const {fatherId, motherId} = ancestorMap[id];

        // Find the inbreeding coefficient for each parent based on their ancestors
        const fatherInbreedingCoeff = calculateInbreedingCoefficientForAncestor(fatherId, ancestorMap);
        const motherInbreedingCoeff = calculateInbreedingCoefficientForAncestor(motherId, ancestorMap);
      
        // Calculate the relationship coefficient (shared ancestor coefficient between parents)
        const commonAncestorsCoeff = calculateCommonAncestorsCoeff(fatherId, motherId, ancestorMap);
      
        // Combine the coefficients
        const childInbreedingCoeff = commonAncestorsCoeff + (fatherInbreedingCoeff / 2) + (motherInbreedingCoeff / 2);
      
        return childInbreedingCoeff;
      }
      
      // Helper function to calculate the relationship coefficient (common ancestors) between parents
      function calculateCommonAncestorsCoeff(fatherId, motherId, ancestorMap) {
        const fatherAncestors = getAncestors(fatherId, ancestorMap);
        const motherAncestors = getAncestors(motherId, ancestorMap);
      
        // Find the intersection (common ancestors)
        const commonAncestors = fatherAncestors.filter(ancestor => motherAncestors.includes(ancestor));
        
        let relationshipCoeff = 0;
        
        // If there are common ancestors, calculate the inbreeding coefficient from them
        for (const ancestor of commonAncestors) {
          relationshipCoeff += calculateInbreedingCoefficientForAncestor(ancestor, ancestorMap);
        }
      
        return relationshipCoeff;
      }
      
      // Helper function to get all ancestors of a given person (recursively)
      function getAncestors(ancestorId, ancestorMap) {
        let ancestors = [];
        let currentAncestorId = ancestorId;
      
        while (currentAncestorId) {
          const ancestor = ancestorMap[currentAncestorId];
          if (ancestor) {
            ancestors.push(currentAncestorId);
            currentAncestorId = ancestor.father_id || ancestor.mother_id;
          } else {
            break;
          }
        }
      
        return ancestors;
      }
    
      
      // Calculate the child's inbreeding coefficient
      const childInbreedingCoeff = calculateChildInbreedingCoefficient(id, ancestorLookup);
      
      console.log("Child's Inbreeding Coefficient:", childInbreedingCoeff);
      

    // Helper function to find common ancestors between two individuals
    // function findCommonAncestors(fatherId, motherId, ancestorLookup) {
    //   const fatherAncestors = getAncestors(fatherId, ancestorLookup);
    //   const motherAncestors = getAncestors(motherId, ancestorLookup);

    //   // Return common ancestors by finding intersection of father and mother's ancestors
    //   return fatherAncestors.filter((ancestor) =>
    //     motherAncestors.includes(ancestor)
    //   );
    // }

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
    // function getPaths(ancestorId, startId, ancestorLookup) {
    //   let paths = [];
    //   let current = startId;

    //   // Traverse upwards through the ancestry and find the path
    //   while (current) {
    //     const ancestor = ancestorLookup[current];
    //     if (ancestor) {
    //       if (ancestorId === current) {
    //         paths.push([ancestorId]);
    //       }
    //       current = ancestor.father_id || ancestor.mother_id;
    //     } else {
    //       break; // Stop if there's no more ancestor data
    //     }
    //   }

    //   return paths;
    // }


    console.log("inbreedingCoefficient:", childInbreedingCoeff);

    // Return the calculated inbreeding coefficient
    res.json(childInbreedingCoeff);
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
