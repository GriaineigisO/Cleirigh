import { createClient } from "@supabase/supabase-js";

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    // Set CORS headers for the response
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      corsOptions.methods.join(", ")
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      corsOptions.allowedHeaders.join(", ")
    );

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // End the response for OPTIONS
    }

    // Validate input
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch data from the Supabase table
    const { data: allTrees, error } = await supabase
      .from("trees") // Replace with your Supabase table name
      .select("tree_name, tree_id") // Replace with desired fields
      .eq("user_id", userId); // Match user_id

    // Handle Supabase errors
    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ message: "Error fetching tree data." });
    }

    // Extract tree names and IDs
    const treeName = allTrees.map(tree => tree.tree_name);
    const treeID = allTrees.map(tree => tree.tree_id);

    console.log(treeName)
    console.log(treeID)

    // Check if trees exist and return accordingly
    if (allTrees && allTrees.length > 0) {
      // If there are multiple trees for this user
      res.json({
        trees: allTrees.map((tree) => ({
          treeName: treeName,
          treeId: treeID,
        })),
      });
    } else {
        console.log("fail")
      res.status(404).json({ message: "No trees found for this user." });
    }


  } catch (error) {
    console.error("Error getting list of all trees:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
