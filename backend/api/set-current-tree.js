import { createClient } from '@supabase/supabase-js';

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your frontend domain
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));
  
// Handle OPTIONS method (for CORS preflight)
if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
    try {
      const { userId, treeId } = req.body;
  
      if (!userId || !treeId) {
        return res.status(400).json({ error: "Missing userId or treeId" });
      }
  
      // Update the current_tree column for the user
      const { data, error } = await supabase
        .from('users')
        .update({ current_tree_id: treeId })
        .eq('id', userId)
        .select('current_tree_id');
  
      if (error) {
        console.error("Error updating current tree:", error.message);
        return res.status(500).json({ error: "Database query failed" });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ error: "User not found or update failed" });
      }
  
      // Return the updated current tree ID
      res.status(200).json({
        success: true,
        message: "Current tree updated successfully",
        currentTree: data[0].current_tree_id,
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };