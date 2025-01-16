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
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Query to get the current tree using Supabase client
    const { data: currentTreeData, error: currentTreeError } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single();

    if (currentTreeError || !currentTreeData) {
      console.error("Error fetching current tree:", currentTreeError.message || "No user data found");
      return res.status(500).json({ error: "Failed to fetch current tree data" });
    }

    const currentTree = currentTreeData.current_tree_id;

    // Get most removed ancestor using Supabase query
    const { data: maxRelationData, error: maxRelationError } = await supabase
      .rpc('get_most_removed_ancestor', { current_tree: currentTree });

    if (maxRelationError || !maxRelationData) {
      console.error("Error fetching max relation:", maxRelationError.message || "No max relation data");
      return res.status(500).json({ error: "Failed to fetch the most removed ancestor" });
    }

    const maxRelation = maxRelationData[0].max_relation;

    // Query the ancestor based on the max relation
    const { data: ancestorData, error: ancestorError } = await supabase
      .from(`tree_${currentTree}`)
      .select('*')
      .contains('relation_to_user', [maxRelation])  // Use contains to match ancestor by relation
      .single();

    if (ancestorError || !ancestorData) {
      console.error("Error fetching ancestor data:", ancestorError.message || "No ancestor data found");
      return res.status(500).json({ error: "Failed to fetch ancestor" });
    }

    // Preparing names and response data
    const firstName = ancestorData.first_name || "";
    const middleName = ancestorData.middle_name || "";
    const lastName = ancestorData.last_name || "";

    res.json({
      name: `${firstName} ${middleName} ${lastName}`,
      link: `profile/${ancestorData.ancestor_id}`,
      relation: ancestorData.relation_to_user,
      sex: ancestorData.sex,
    });

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
