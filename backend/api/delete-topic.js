// Import necessary modules
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
      const { userId, topicId } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
    .from("users")
    .select("current_tree_id")
    .eq("id", userId)
    .single();

  const currentTree = user.current_tree_id;

  const { data, error } = await supabase
  .from(`topics`)
  .delete()
  .eq("id", topicId);

  
      res.json({ message: "Topic deleted successfully" });
  
    } catch (error) {
      console.log("Error deleting topic:", error);
      res.status(500).json({ error: "Error deleting topic" });
    }
  };