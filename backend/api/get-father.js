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
  
      const fatherID = parentQuery.father_id;
  
      // Query for the father’s information using father ID
      const { data: fatherQuery, error: fatherError } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .eq('ancestor_id', fatherID)
        .single(); // Get a single row
  
      if (fatherError) {
        throw new Error(fatherError.message);
      }
  
      if (fatherID && fatherQuery) {
        // Set default values if data is missing
        const fatherFirstName = fatherQuery.first_name ?? "UNKNOWN";
        const fatherMiddleName = fatherQuery.middle_name ?? "";
        const fatherLastName = fatherQuery.last_name ?? "";
  
        const fatherFullName = `${fatherFirstName} ${fatherMiddleName} ${fatherLastName}`;
  
        res.json({
          fatherID: fatherID,
          fatherFullName: fatherFullName,
          fatherFirstName: fatherFirstName,
          fatherMiddleName: fatherMiddleName,
          fatherLastName: fatherLastName,
          fatherBirthDate: fatherQuery.date_of_birth,
          fatherBirthPlace: fatherQuery.place_of_birth,
          fatherDeathDate: fatherQuery.date_of_death,
          fatherDeathPlace: fatherQuery.place_of_death,
          fatherOccupation: fatherQuery.occupation,
          fatherProfileNumber: fatherQuery.ancestor_id,
          fatherEthnicity: fatherQuery.ethnicity,
          fatherCauseOfDeath: fatherQuery.cause_of_death,
          relation_to_user: fatherQuery.relation_to_user,
          uncertainFirstName: fatherQuery.uncertain_first_name,
          uncertainMiddleName: fatherQuery.uncertain_middle_name,
          uncertainLastName: fatherQuery.uncertain_last_name,
          uncertainBirthDate: fatherQuery.uncertain_birth_date,
          uncertainBirthPlace: fatherQuery.uncertain_birth_place,
          uncertainDeathDate: fatherQuery.uncertain_death_date,
          uncertainDeathPlace: fatherQuery.uncertain_death_place,
          uncertainOccupation: fatherQuery.uncertain_occupation,
          pageNum: fatherQuery.base_of_page,
          memberOfNobility: fatherQuery.member_of_nobility,
        });
      } else {
        // In case no father is found, return null values
        res.json({
          fatherID: null,
          fatherFullName: null,
          fatherFirstName: null,
          fatherMiddleName: null,
          fatherLastName: null,
          fatherBirthDate: null,
          fatherBirthPlace: null,
          fatherDeathDate: null,
          fatherDeathPlace: null,
          fatherOccupation: null,
          fatherProfileNumber: null,
          fatherEthnicity: null,
          fatherCauseOfDeath: null,
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
      console.log("Error getting father:", error);
      res.status(500).json({ error: "Error fetching father's data" });
    }
  };