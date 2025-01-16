import { createClient } from '@supabase/supabase-js';

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", 
  methods: ['GET', 'POST', 'OPTIONS'], 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
/*delete this comment*/
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

  // Handle OPTIONS method (for CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Query to fetch all trees for the given user ID
    const { data: allTrees, error } = await supabase
      .from('trees')  // Ensure your Supabase table name matches
      .select('tree_name, tree_id')  // Ensure column names match
      .eq('user_id', userId);  // Ensure `user_id` is correct

    // Handle query errors
    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ message: "Error fetching tree data." });
    }

    // Extract tree names and IDs
    const treeName = allTrees.map(tree => tree.tree_name);
    const treeID = allTrees.map(tree => tree.tree_id);

    res.json({
      treeName: treeName,
      treeID: treeID,
    });

  } catch (error) {
    console.error("Error getting list of all trees:", error);
    res.status(500).json({ message: "Server error" });
  }
}
