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
      const { userId, profileData } = req.body;
      // Query to get the current tree
      
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

      const {data: getSources} = await supabase 
        .from(`sources`)
        .eq('tree_id', currentTree)
        .eq('ancestor_id', profileData.ancestor_id)
  
      const source_link_name = getSources.rows.map((row) => row.source_link_name);
      const source_link = getSources.rows.map((row) => row.source_link);
      const source_text_name = getSources.rows.map((row) => row.source_text_name);
      const source_text_author = getSources.rows.map(
        (row) => row.source_text_author
      );
  
      const source_link_name_filtered = source_link_name.filter(
        (i) => i !== null
      );
      const source_link_filtered = source_link.filter((i) => i !== null);
      const source_text_name_filtered = source_text_name.filter(
        (i) => i !== null
      );
      const source_text_author_filtered = source_text_author.filter(
        (i) => i !== null
      );
  
      res.json({
        source_link_name: source_link_name_filtered,
        source_link: source_link_filtered,
        source_text_name: source_text_name_filtered,
        source_text_author: source_text_author_filtered,
      });
    } catch (error) {
      console.log("error getting sources:", error);
    }
  };