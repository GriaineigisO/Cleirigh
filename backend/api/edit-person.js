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
      const { userId, personDetails } = req.body;
  
      // Get current tree id from users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = user.current_tree_id;
  
      // Update the person's details in the relevant tree table
      const { data: updatedPerson, error: updateError } = await supabase
        .from(`tree_${currentTree}`)
        .update({
          first_name: personDetails.firstName,
          middle_name: personDetails.middleName,
          last_name: personDetails.lastName,
          ethnicity: personDetails.ethnicity,
          date_of_birth: personDetails.birthDate,
          place_of_birth: personDetails.birthPlace,
          date_of_death: personDetails.deathDate,
          place_of_death: personDetails.deathPlace,
          cause_of_death: personDetails.causeOfDeath,
          occupation: personDetails.occupation,
          member_of_nobility: personDetails.memberOfNobility,
        })
        .eq('ancestor_id', personDetails.id);
  
      if (updateError) {
        throw new Error(updateError.message);
      }
  
      res.json({ success: true, message: 'Person details updated successfully!' });
  
    } catch (error) {
      console.log("Error editing person:", error);
      res.status(500).json({ error: "Error updating person details" });
    }
  };