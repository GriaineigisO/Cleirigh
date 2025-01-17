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

    // Get the current tree ID for the user
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

    // Get the base person from the tree
    const { data: basePersonData, error: basePersonError } = await supabase
      .from(`tree_${currentTree}`)
      .select('*')
      .eq('base_person', true)
      .single();

    if (basePersonError || !basePersonData) {
      console.error("Error fetching base person data:", basePersonError.message || "No base person found");
      return res.status(500).json({ error: "Failed to fetch base person" });
    }

    // Construct the full name and prepare the response
    const fullName = `${basePersonData.first_name} ${basePersonData.middle_name} ${basePersonData.last_name}`;

    res.json({
      firstName: basePersonData.first_name,
      middleName: basePersonData.middle_name,
      lastName: basePersonData.last_name,
      id: basePersonData.ancestor_id,
      fullName: fullName,
      birthDate: basePersonData.date_of_birth,
      birthPlace: basePersonData.place_of_birth,
      deathDate: basePersonData.date_of_death,
      deathPlace: basePersonData.place_of_death,
      occupation: basePersonData.occupation,
      ethnicity: basePersonData.ethnicity,
      profileNumber: basePersonData.ancestor_id,
      sex: basePersonData.sex_id,
      memberOfNobility: basePersonData.member_of_nobility,
    });

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
