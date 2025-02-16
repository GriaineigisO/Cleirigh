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
if (req.method === 'OPTIONS') {3
    res.status(200).end();
    return;
  }

    try {
      const { userId, bottomPersonDetails } = req.body;
  
      // Get the current tree ID from the user's record
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = user.current_tree_id;
  
      //find all rows where person is either father_id or mother_id
      console.log(bottomPersonDetails.sex)
      const parentId = bottomPersonDetails.sex === "male" ? "father_id" : "mother_id"
      const { data: findChildren, error: findChildrenError } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .eq([parentId], bottomPersonDetails.id)
  
    console.log(findChildren)
      res.json(findChildren);
    } catch (error) {
      console.log("Error getting child pages: ", error);
      res.status(500).json({ error: "Error getting child pages" });
    }
  };