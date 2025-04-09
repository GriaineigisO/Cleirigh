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
      
          // Calculate the inbreeding coefficient for the current ancestor based on their parents
          let F = 0;
      
          if (father_id && mother_id) {
            // Both parents exist, calculate the inbreeding coefficient recursively
            const fatherCoeff = getF(father_id);
            const motherCoeff = getF(mother_id);
      
            // Half the coefficient from each parent and combine
            F += 0.5 * (fatherCoeff + motherCoeff);
          } else if (father_id) {
            // Only the father exists, calculate inbreeding based on the father's side
            F += 0.5 * getF(father_id);
          } else if (mother_id) {
            // Only the mother exists, calculate inbreeding based on the mother's side
            F += 0.5 * getF(mother_id);
          }
      
          memo.set(id, F);
          return F;
        }
      
        // Start the recursion from the given ancestorId
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
