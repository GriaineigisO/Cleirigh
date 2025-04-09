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

    function calculateInbreedingCoefficient(ancestorId, ancestorsMap) {
      const memo = new Map(); // for caching F values

      function getF(id) {
        if (!id || !ancestorsMap[id]) {
          console.log("id or ancestorsmap is undefined");
          return 0;
        }
        if (memo.has(id)) {
          console.log("memo has id");
          return memo.get(id);
        }

        const { father_id, mother_id } = ancestorsMap[id];
        if (!father_id || !mother_id) {
          memo.set(id, 0);
          return 0;
        }

        const commonAncestors = findCommonAncestors(
          father_id,
          mother_id,
          ancestorsMap
        );

        console.log("Common Ancestors:", commonAncestors);

        // Function to find common ancestors between father and mother
        function findCommonAncestors(fatherId, motherId, ancestorLookup) {
          console.log("Ancestor Lookup:", ancestorLookup);
          console.log(
            "Father Ancestors:",
            getAncestors(father_id, ancestorLookup)
          );
          console.log(
            "Mother Ancestors:",
            getAncestors(mother_id, ancestorLookup)
          );

          const fatherAncestors = getAncestors(fatherId, ancestorLookup);
          const motherAncestors = getAncestors(motherId, ancestorLookup);

          // Return common ancestors by finding intersection of father and mother's ancestors
          return fatherAncestors.filter((ancestor) =>
            motherAncestors.includes(ancestor)
          );
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
              current = ancestor.father_id || ancestor.mother_id; // move up to the father or mother
            } else {
              break; // Stop if there's no more ancestor data
            }
          }

          return ancestors;
        }

        let F = 0;
        for (const ca of commonAncestors) {
          const pathsToFather = getPaths(ca, father_id, ancestorsMap);
          const pathsToMother = getPaths(ca, mother_id, ancestorsMap);

          console.log(
            "Paths to Father:",
            getPaths(ca, father_id, ancestorsMap)
          );
          console.log(
            "Paths to Mother:",
            getPaths(ca, mother_id, ancestorsMap)
          );

          for (const pf of pathsToFather) {
            for (const pm of pathsToMother) {
              const n1 = pf.length;
              const n2 = pm.length;
              const Fca = getF(ca);
              const coeff = Math.pow(0.5, n1 + n2 + 1) * (1 + Fca);
        
              if (coeff > 0) { // Check if the coefficient is contributing
                F += coeff;
              }
            }
          }
        }

        // Helper function to retrieve all possible paths to a given ancestor
        function getPaths(ancestorId, targetId, ancestorLookup) {
          let paths = [];

          // Helper function to find all paths from a starting point to the target
          function findPaths(currentId, path) {
            if (!currentId || !ancestorLookup[currentId]) {
              return; // Stop if no ancestor is found or we've reached the root
            }

            // Add current ID to the path
            path.push(currentId);

            // If the current ancestor is the target, add the path to the paths list
            if (currentId === targetId) {
              paths.push([...path]); // Clone path array before pushing
            } else {
              // Continue searching along father_id and mother_id
              const ancestor = ancestorLookup[currentId];
              if (ancestor.father_id) {
                findPaths(ancestor.father_id, path);
              }
              if (ancestor.mother_id) {
                findPaths(ancestor.mother_id, path);
              }
            }

            // Remove the current ancestor to backtrack
            path.pop();
          }

          // Start the search from the given ancestorId
          findPaths(ancestorId, []);

          return paths;
        }

        memo.set(id, F);
        console.log("F:", F);
        return F;
      }

      return getF(ancestorId);
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
