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
      const { userId, father, mother } = req.body;
  
      // Query to get the current tree
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = user.current_tree_id;
  
      // Function to fetch parent details and handle missing values
      const getParentDetails = async (parentId) => {
        if (!parentId) return null;
        
        const { data: parent, error: parentError } = await supabase
          .from(`tree_${currentTree}`)
          .select('*')
          .eq('ancestor_id', parentId)
          .single();
  
        if (parentError) {
          throw new Error(parentError.message);
        }
  
        // Handle missing values
        const firstName = parent.first_name || "UNKNOWN";
        const middleName = parent.middle_name || "";
        const lastName = parent.last_name || "";
        
        return { name: `${firstName} ${middleName} ${lastName}`, id: parent.ancestor_id };
      };
  
      // Fetch father details
      const fatherDetails = await getParentDetails(father);
  
      // Fetch mother details
      const motherDetails = await getParentDetails(mother);
  
      res.json({
        father: fatherDetails ? fatherDetails.name : "",
        mother: motherDetails ? motherDetails.name : "",
        fatherId: fatherDetails ? fatherDetails.id : "",
        motherId: motherDetails ? motherDetails.id : ""
      });
    } catch (error) {
      console.log("Error getting ancestor's profile: ", error);
      res.status(500).json({ error: "Error getting parent's details" });
    }
  };