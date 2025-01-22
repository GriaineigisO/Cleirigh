// Import necessary modules
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
      const {
        firstName,
        middleName,
        lastName,
        sex,
        ethnicity,
        birthDate,
        birthPlace,
        deathDate,
        deathPlace,
        deathCause,
        occupation,
        currentTree,
      } = req.body;
  
      // Make random six-digit number for ancestor_id
      const ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
      const page_number = 1;
      const base_person = true;
  
      const treeTableName = `tree_${currentTree}`;
  
      const { data, error } = await supabase
        .from(treeTableName)
        .insert([
          {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            ancestor_id: ancestor_id,
            page_number: page_number,
            base_person: base_person,
            base_of_page: 1, 
            sex: sex,
            ethnicity: ethnicity,
            date_of_birth: birthDate,
            place_of_birth: birthPlace,
            date_of_death: deathDate,
            place_of_death: deathPlace,
            cause_of_death: deathCause,
            occupation: occupation,
            relation_to_user: [0], 
          }
        ]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      res.status(200).json({ message: "First person added successfully!" });
    } catch (error) {
      console.log("Error adding first person:", error);
      res.status(500).json({ error: "Error adding first person." });
    }
  };
  