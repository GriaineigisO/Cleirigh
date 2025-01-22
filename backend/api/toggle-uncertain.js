import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
    res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

    // Handle OPTIONS method for CORS preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
      const { userId, details, infoType } = req.body;
  
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
  
      // Query to check the current uncertain value
      const { data: ancestorData, error: ancestorError } = await supabase
        .from(`tree_${currentTree}`)
        .select(`${infoType}, uncertain_${infoType}`)
        .eq('ancestor_id', details.id)
        .single();
  
      if (ancestorError) {
        throw new Error(ancestorError.message);
      }
  
      // Get the current uncertain value for the provided infoType
      const currentBool = ancestorData[`uncertain_${infoType}`];
  
      // Toggle the boolean value
      const newBool = !currentBool;
  
      // Update the uncertain flag in the database
      const { data: updatedData, error: updateError } = await supabase
        .from(`tree_${currentTree}`)
        .update({ [`uncertain_${infoType}`]: newBool })
        .eq('ancestor_id', details.id);
  
      if (updateError) {
        throw new Error(updateError.message);
      }
  
      // Return the updated uncertain value in the response
      res.json(newBool);
  
    } catch (error) {
      console.log("Error toggling uncertain status:", error);
      res.status(500).json({ error: "Error toggling uncertain status" });
    }
  };