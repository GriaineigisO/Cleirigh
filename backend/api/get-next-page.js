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
      const { userId, personID } = req.body;
  
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
  
      // Fetch the base_of_page for the provided personID
      const { data: pageData, error: pageError } = await supabase
        .from(`tree_${currentTree}`)
        .select('base_of_page')
        .eq('ancestor_id', personID)
        .single();
  
      if (pageError) {
        throw new Error(pageError.message);
      }
  
      const nextPage = Number(pageData ? pageData.base_of_page : 0); // Default to 0 if not found
  
      res.json({ pageNum: nextPage });
    } catch (error) {
      console.log("Error getting next page: ", error);
      res.status(500).json({ error: "Error getting next page" });
    }
  };