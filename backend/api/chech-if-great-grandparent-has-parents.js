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
      const { userId, greatgrandparentID } = req.body;
  
      // Query to get the current tree id
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = user.current_tree_id;
  
      // Query to get the great-grandparent's details
      const { data: greatGrandparent, error: greatGrandparentError } = await supabase
        .from(`tree_${currentTree}`)
        .select('father_id, mother_id')
        .eq('ancestor_id', greatgrandparentID)
        .single();
  
      if (greatGrandparentError) {
        throw new Error(greatGrandparentError.message);
      }
  
      // Check if the great-grandparent has parents (father or mother)
      if (greatGrandparent.father_id !== null || greatGrandparent.mother_id !== null) {
        res.json(true);
      } else {
        res.json(false);
      }
  
    } catch (error) {
      console.log("Error checking greatgrandparent's parents:", error);
      res.status(500).json({ error: "Error checking greatgrandparent's parents" });
    }
  };