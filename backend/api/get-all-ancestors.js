import { createClient } from '@supabase/supabase-js';

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", 
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
  
      // Query to get the current tree ID for the user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = userData?.current_tree_id;
  
      // Check if currentTree exists before proceeding
      if (!currentTree) {
        return res.status(404).json({ error: "Current tree not found" });
      }
  
      const treeTableName = `tree_${currentTree}`;
  
      // Fetch the ancestors data from the dynamically named table
      const { data: ancestorsData, error: ancestorsError } = await supabase
        .from(treeTableName)
        .select(
          'first_name, middle_name, last_name, sex, date_of_birth, place_of_birth, date_of_death, place_of_death, ethnicity, base_person'
        );
  
      if (ancestorsError) {
        throw new Error(ancestorsError.message);
      }
  
      // Extract arrays from the response
      const firstNames = ancestorsData.map((row) => row.first_name);
      const middleNames = ancestorsData.map((row) => row.middle_name);
      const lastNames = ancestorsData.map((row) => row.last_name);
      const sexes = ancestorsData.map((row) => row.sex);
      const datesOfBirth = ancestorsData.map((row) => row.date_of_birth);
      const placesOfBirth = ancestorsData.map((row) => row.place_of_birth);
      const datesOfDeath = ancestorsData.map((row) => row.date_of_death);
      const placesOfDeath = ancestorsData.map((row) => row.place_of_death);
      const ethnicities = ancestorsData.map((row) => row.ethnicity);
      const basePerson = ancestorsData.map((row) => row.base_person);
  
      // Return all extracted data in response
      res.json({
        firstNames: firstNames,
        middleNames: middleNames,
        lastNames: lastNames,
        sexes: sexes,
        datesOfBirth: datesOfBirth,
        placesOfBirth: placesOfBirth,
        datesOfDeath: datesOfDeath,
        placesOfDeath: placesOfDeath,
        ethnicities: ethnicities,
        basePerson: basePerson,
      });
    } catch (error) {
      console.log("Error fetching all ancestors:", error);
      res.status(500).json({ error: "Server error occurred" });
    }
  };
  