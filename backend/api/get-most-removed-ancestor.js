import { supabase } from '../../utils/supabase'; // Adjust the path based on your file structure

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
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;

      // Query to get the current tree
      const { data: currentTreeData, error: currentTreeError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();

      if (currentTreeError || !currentTreeData) {
        console.error('Error fetching current tree:', currentTreeError ? currentTreeError.message : 'No data');
        return res.status(500).json({ error: "Failed to get current tree" });
      }

      const currentTree = currentTreeData.current_tree_id;

      // Fetch the ancestor with the highest relation_to_user value
      const { data: mostRemovedAncestorData, error: mostRemovedAncestorError } = await supabase
        .from(`tree_${currentTree}`)
        .select('ancestor_id, relation_to_user')
        .order('relation_to_user', { ascending: false })  // Sort in descending order
        .limit(1)  // Get only the first (most removed ancestor)
        .single();  // Expect a single result

      if (mostRemovedAncestorError || !mostRemovedAncestorData) {
        console.error("Error fetching most removed ancestor:", mostRemovedAncestorError ? mostRemovedAncestorError.message : 'No data');
        return res.status(500).json({ error: "Failed to fetch the most removed ancestor" });
      }

      // Retrieve ancestor data
      const ancestorId = mostRemovedAncestorData.ancestor_id;
      const relationToUser = mostRemovedAncestorData.relation_to_user;

      // Fetch the corresponding details for the ancestor
      const { data: ancestorDetails, error: ancestorDetailsError } = await supabase
        .from(`tree_${currentTree}`)
        .select('first_name, middle_name, last_name, sex, ancestor_id')
        .eq('ancestor_id', ancestorId)
        .single();

      if (ancestorDetailsError || !ancestorDetails) {
        console.error("Error fetching ancestor details:", ancestorDetailsError ? ancestorDetailsError.message : 'No data');
        return res.status(500).json({ error: "Failed to fetch ancestor details" });
      }

      const fullName = `${ancestorDetails.first_name} ${ancestorDetails.middle_name || ''} ${ancestorDetails.last_name}`;

      res.status(200).json({
        name: fullName,
        link: `profile/${ancestorId}`,
        relation: relationToUser,
        sex: ancestorDetails.sex,
      });

    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Unexpected server error" });
    }
  } else {
    // If method is not POST
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
