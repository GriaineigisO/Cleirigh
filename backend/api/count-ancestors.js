// Import necessary modules
import { createClient } from "@supabase/supabase-js";

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your frontend domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(", ")
  );

  // Handle OPTIONS method (for CORS preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { currentTree } = req.body;

    if (!currentTree) {
      return res.status(400).json({ error: "No valid tree provided" });
    }

    const treeTableName = `tree_${currentTree}`;

    // Fetch all rows from the tree_{currentTree} table
    async function fetchAllRows() {
      let allData = [];
      let from = 0;
      const batchSize = 1000; // Supabase limit
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from(treeTableName)
          .select("*")
          .range(from, from + batchSize - 1);

        if (error) {
          throw new Error(error.message);
        }

        allData = allData.concat(data);
        from += batchSize;

        // If less than batchSize rows were returned, we're done
        if (data.length < batchSize) {
          hasMore = false;
        }
      }

      return allData;
    }

    let ancestorCount = "";
    (async () => {
      const data = await fetchAllRows();

      // Exclude the first row (base person)
      ancestorCount = data.length - 1;
      console.log(ancestorCount);
      // Return the ancestor count in the response
      res.json(ancestorCount);
    })();
  } catch (error) {
    console.log("Error counting ancestors:", error);
    res.status(500).json({ error: "Failed to count ancestors." });
  }
}
