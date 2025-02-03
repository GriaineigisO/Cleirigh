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
  
      // Query to get the current tree
      const { data: currentTreeData, error: currentTreeError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single(); // Get a single row
  
      if (currentTreeError) {
        throw new Error(currentTreeError.message);
      }
  
      const currentTree = currentTreeData.current_tree_id;
  
      // Query to find the person's parents
      const { data: parentQuery, error: parentError } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .eq('ancestor_id', personID)
        .single(); // Get a single row
  
      if (parentError) {
        throw new Error(parentError.message);
      }
  
      const motherID = parentQuery.mother_id;
  
      // Query for the mother’s information using mother ID
      const { data: motherQuery, error: motherError } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .eq('ancestor_id', motherID)
        .single(); // Get a single row
  
      if (motherError) {
        res.status(500).json({ error: "Error fetching mother's data" });
        throw new Error(motherError.message);
      }
  
      if (motherID && motherQuery) {
        // Set default values if data is missing
        const motherFirstName = motherQuery.first_name ?? "UNKNOWN";
        const motherMiddleName = motherQuery.middle_name ?? "";
        const motherLastName = motherQuery.last_name ?? "";
  
        const motherFullName = `${motherFirstName} ${motherMiddleName} ${motherLastName}`;
  
        res.json({
          motherID: motherID,
          motherFullName: motherFullName,
          motherFirstName: motherFirstName,
          motherMiddleName: motherMiddleName,
          motherLastName: motherLastName,
          motherBirthDate: motherQuery.date_of_birth,
          motherBirthPlace: motherQuery.place_of_birth,
          motherDeathDate: motherQuery.date_of_death,
          motherDeathPlace: motherQuery.place_of_death,
          motherOccupation: motherQuery.occupation,
          motherProfileNumber: motherQuery.ancestor_id,
          motherEthnicity: motherQuery.ethnicity,
          motherCauseOfDeath: motherQuery.cause_of_death,
          relation_to_user: motherQuery.relation_to_user,
          uncertainFirstName: motherQuery.uncertain_first_name,
          uncertainMiddleName: motherQuery.uncertain_middle_name,
          uncertainLastName: motherQuery.uncertain_last_name,
          uncertainBirthDate: motherQuery.uncertain_birth_date,
          uncertainBirthPlace: motherQuery.uncertain_birth_place,
          uncertainDeathDate: motherQuery.uncertain_death_date,
          uncertainDeathPlace: motherQuery.uncertain_death_place,
          uncertainOccupation: motherQuery.uncertain_occupation,
          pageNum: motherQuery.base_of_page,
          memberOfNobility: motherQuery.member_of_nobility,
        });
      } else {
        // In case no mother is found, return null values
        res.json({
          motherID: null,
          motherFullName: null,
          motherFirstName: null,
          motherMiddleName: null,
          motherLastName: null,
          motherBirthDate: null,
          motherBirthPlace: null,
          motherDeathDate: null,
          motherDeathPlace: null,
          motherOccupation: null,
          motherProfileNumber: null,
          motherEthnicity: null,
          motherCauseOfDeath: null,
          relation_to_user: null,
          uncertainFirstName: null,
          uncertainMiddleName: null,
          uncertainLastName: null,
          uncertainBirthDate: null,
          uncertainBirthPlace: null,
          uncertainDeathDate: null,
          uncertainDeathPlace: null,
          uncertainOccupation: null,
          pageNum: null,
          memberOfNobility: null,
        });
      }
    } catch (error) {
      console.log("Error getting mother:", error);
      res.status(500).json({ error: "Error fetching mother's data" });
    }
  };