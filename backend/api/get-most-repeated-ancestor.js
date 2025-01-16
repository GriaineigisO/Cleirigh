import { createClient } from '@supabase/supabase-js';

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com",  // Replace with your frontend domain
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
    // Expecting the body to contain a userId
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Fetch current tree ID for the user (retrieved from users table)
    const { data: currentTreeData, error: currentTreeError } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single();

    if (currentTreeError || !currentTreeData) {
      console.error("Error fetching current tree:", currentTreeError ? currentTreeError.message : "No data found");
      return res.status(500).json({ error: "Failed to fetch current tree" });
    }

    const currentTree = currentTreeData.current_tree_id;

    // Call the database function get_most_repeated_ancestor
    const { data, error } = await supabase.rpc('get_most_repeated_ancestor', {
      current_tree: currentTree
    });

    if (error) {
      console.error("Error fetching most repeated ancestor:", error.message);
      return res.status(500).json({ error: "Failed to fetch most repeated ancestor" });
    }

    // Returning the result if no errors
    res.json({
      ancestorId: data[0].ancestor_id,
      fullName: `${data[0].first_name} ${data[0].middle_name || ''} ${data[0].last_name}`,
      relationToUser: data[0].relation_to_user.length
    });
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
