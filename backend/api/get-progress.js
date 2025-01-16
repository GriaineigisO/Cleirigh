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
    
    // Step 1: Log when the API is called
    console.log('API called with userId:', userId);

    if (!userId) {
      console.error("Missing userId in request body.");
      return res.status(400).json({ error: "Missing userId" });
    }

    // Step 2: Log database query for current tree
    console.log("Fetching current tree id for user:", userId);
    
    const { data: currentTreeData, error: currentTreeError } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single();

    if (currentTreeError || !currentTreeData) {
      console.error("Error fetching current tree:", currentTreeError ? currentTreeError.message : 'No user data found');
      return res.status(500).json({ error: "Failed to fetch current tree data" });
    }

    const currentTree = currentTreeData.current_tree_id;
    console.log("Current tree id fetched:", currentTree);

    // Step 3: Log database query for progress data
    console.log("Fetching progress data for tree:", currentTree);
    
    const { data: progressData, error: progressError } = await supabase
      .from('trees')
      .select('*')
      .eq('tree_id', currentTree)
      .single();

    if (progressError || !progressData) {
      console.error("Error fetching progress data:", progressError ? progressError.message : 'No progress data found');
      return res.status(500).json({ error: "Failed to fetch progress data" });
    }

    // Step 4: Log for invalid progress_id
    if (!progressData.progress_id) {
      console.error("Invalid progress_id (NULL or missing) for tree:", currentTree);
      return res.status(400).json({ error: "Invalid progress_id, it is null or undefined" });
    }

    console.log("Progress data fetched with progress_id:", progressData.progress_id);

    // Step 5: Fetch person data based on progress_id
    console.log("Fetching person data from tree", currentTree, "for progress_id:", progressData.progress_id);

    const { data: personData, error: personError } = await supabase
      .from(`tree_${currentTree}`)
      .select('*')
      .eq('ancestor_id', progressData.progress_id)
      .single();

    if (personError || !personData) {
      console.error("Error fetching person data:", personError ? personError.message : 'No person data found');
      return res.status(500).json({ error: "Failed to fetch person data" });
    }

    // Step 6: Check progress_id existence and construct the full name
    if (progressData.progress_id) {
      console.log("Progress ID exists, constructing full name.");
      
      let firstName = personData.first_name || "UNKNOWN";
      let middleName = personData.middle_name || "";
      let lastName = personData.last_name || "";

      let fullName = `${firstName} ${middleName} ${lastName}`;

      res.json({
        name: fullName,
        link: `profile/${progressData.progress_id}`,
        note: progressData.progress_note,
        bool: true,
      });
    } else {
      console.error("No progress_id in progress data.");
      res.json({ bool: false });
    }

  } catch (error) {
    console.error("Unexpected error:", error.message || error);
    res.status(500).json({ error: "Server error" });
  }
}
