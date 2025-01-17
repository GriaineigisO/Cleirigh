import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
    res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

    // Handle OPTIONS method for CORS preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Step 1: Get the current tree ID for the user
    const { data: userData, error: userError } = await supabase
      .from('users') // Replace 'users' with your actual table name
      .select('current_tree_id') // Select only `current_tree_id`
      .eq('id', userId) // Filter by user ID
      .single(); // Expect one result

    if (userError || !userData) {
      console.error("Error fetching current_tree_id:", userError || "No user found");
      return res.status(404).json({ error: "User or current tree not found" });
    }

    const currentTreeId = userData.current_tree_id;

    // Step 2: Get the tree name for the current tree ID
    const { data: treeData, error: treeError } = await supabase
      .from('trees') // Replace 'trees' with your actual table name
      .select('tree_name') // Select only `tree_name`
      .eq('tree_id', currentTreeId) // Filter by tree ID
      .single(); // Expect one result

    if (treeError || !treeData) {
      console.error("Error fetching tree name:", treeError || "No tree found");
      return res.status(404).json({ error: "Tree not found" });
    }

    const treeName = treeData.tree_name;

    // Respond with the tree name
    res.status(200).json({ treeName });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
