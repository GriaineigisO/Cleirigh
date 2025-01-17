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
    // Fetch userId from the request body
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Query to get the current tree using Supabase client
    const { data, error } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single(); // Use .single() to get a single row rather than an array

    if (error) {
      console.error("Error fetching current tree:", error.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the current tree ID
    res.status(200).json({
      success: true,
      currentTree: data.current_tree_id,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
