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
    const { currentTree } = req.body;

    if (!currentTree) {
      return res.status(400).json({ error: "No valid tree provided" });
    }

    const treeTableName = `tree_${currentTree}`; // Dynamic table name

    // Get all rows from the dynamically named table
    const { data, error } = await supabase
      .from(treeTableName)
      .select('*'); // Selecting all rows to check if the table is empty

    if (error) {
      console.error("Error checking if tree is empty:", error.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    // If data is not empty, return isEmpty: false
    if (data.length > 0) {
      res.json({ isEmpty: false });
    } else {
      // If data is empty, return isEmpty: true
      res.json({ isEmpty: true });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
