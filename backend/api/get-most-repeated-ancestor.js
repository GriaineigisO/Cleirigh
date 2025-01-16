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

    // Get the current tree id for the user using Supabase query
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

    // Get the most repeated ancestor by finding the ancestor with the largest relation_to_user array
    const { data: mostRepeatedAncestorData, error: mostRepeatedAncestorError } = await supabase
      .from(`tree_${currentTree}`)
      .select('ancestor_id, relation_to_user, first_name, middle_name, last_name')
      .order('relation_to_user', { ascending: false })
      .limit(1) // Limiting to 1 row (most repeated)
      .single();

    if (mostRepeatedAncestorError || !mostRepeatedAncestorData) {
      console.error("Error fetching most repeated ancestor:", mostRepeatedAncestorError.message || "No ancestor data found");
      return res.status(500).json({ error: "Failed to fetch most repeated ancestor" });
    }

    // Calculate the number of repetitions (length of the array)
    const repeatedTimes = mostRepeatedAncestorData.relation_to_user.length;

    // Extract names and handle undefined/null values
    const firstName = mostRepeatedAncestorData.first_name || "";
    const middleName = mostRepeatedAncestorData.middle_name || "";
    const lastName = mostRepeatedAncestorData.last_name || "";

    // Respond with ancestor details
    res.json({
      name: `${firstName} ${middleName} ${lastName}`,
      link: `profile/${mostRepeatedAncestorData.ancestor_id}`,
      repeatedTimes: repeatedTimes,
    });

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
