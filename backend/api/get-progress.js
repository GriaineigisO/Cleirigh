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

    // Get the current tree for the user
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

    // Get the progress data for the tree
    const { data: progressData, error: progressError } = await supabase
      .from('trees')
      .select('*')
      .eq('tree_id', currentTree)
      .single();

    if (progressError || !progressData) {
      console.error("Error fetching progress data:", progressError.message || "No progress data found");
      return res.status(500).json({ error: "Failed to fetch progress data" });
    }

    // Check if progress_id is NULL
    if (!progressData.progress_id) {
      return res.status(200).json({
        bool: false
      });
    } else {


    // Fetch the person based on the progress_id only if it's not NULL
    const { data: personData, error: personError } = await supabase
      .from(`tree_${currentTree}`)
      .select('*')
      .eq('ancestor_id', progressData.progress_id)
      .single();

    // Check if there was an error fetching the person data or no person found
    if (personError || !personData) {
      console.error("Error fetching person data:", personError.message || "No person data found");
      return res.status(500).json({ error: "Failed to fetch person data" });
    }

    // Construct full name and send the response
    const firstName = personData.first_name || "UNKNOWN";
    const middleName = personData.middle_name || "";
    const lastName = personData.last_name || "";
    const fullName = `${firstName} ${middleName} ${lastName}`;

    res.json({
      name: fullName,
      link: `profile/${progressData.progress_id}`,
      note: progressData.progress_note,
      bool: true,
    });

}

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
