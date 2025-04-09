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
        if (memo.has(id)) return memo.get(id);

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

        // Function to find common ancestors between father and mother
        function findCommonAncestors(fatherId, motherId, ancestorLookup) {
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

          for (const pf of pathsToFather) {
            for (const pm of pathsToMother) {
              const n1 = pf.length;
              const n2 = pm.length;
              const Fca = getF(ca);
              F += Math.pow(0.5, n1 + n2 + 1) * (1 + Fca);
            }
          }
        }

        memo.set(id, F);
        return F;
      }

      return getF(ancestorId);
    }

    const inbreedingCoefficient = calculateInbreedingCoefficient(
      id,
      ancestorLookup
    );

    // Return the calculated inbreeding coefficient
    res.json(inbreedingCoefficient);
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
