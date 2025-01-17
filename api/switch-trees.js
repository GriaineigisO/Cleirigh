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
      const { userId, treeId } = req.body;
  
      // Switch the user's current tree
      const { data, error } = await supabase
        .from('users')
        .update({ current_tree_id: treeId })
        .eq('id', userId);
  
      if (error) {
        throw new Error(error.message);
      }
  
      res.json(true);
    } catch (error) {
      console.log("Error switching trees: ", error);
      res.status(500).json({ error: "Error switching trees" });
    }
  };