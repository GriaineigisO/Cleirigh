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
      const { userId, pageNum } = req.body;

      const pageNumber = Number(pageNum);

      console.log("Pagenumber is:", pageNum)
      console.log("pageNumber is a ", typeof pageNumber)
  
      // Get the current page number from the user's record
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      // const currentPageNum = Number(user.current_page);
       const currentTree = user.current_tree_id;
  
      // Get the ancestor's details from the current tree using the page number
      const { data: baseOfPage, error: pageError } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .eq('base_of_page', pageNumber)
        .single();
  
      if (pageError) {
        throw new Error(pageError.message);
      }
  
      // Prepare name values, replace null values with defaults
      const firstName = baseOfPage.first_name || "UNKNOWN";
      const middleName = baseOfPage.middle_name || "";
      const lastName = baseOfPage.last_name || "";
      
      const fullName = `${firstName} ${middleName} ${lastName}`;
  
      // Respond with the required details
      res.json({
        pageNum: pageNumber,
        firstName,
        middleName,
        lastName,
        fullName,
        id: baseOfPage.ancestor_id,
        birthDate: baseOfPage.date_of_birth,
        birthPlace: baseOfPage.place_of_birth,
        deathDate: baseOfPage.date_of_death,
        deathPlace: baseOfPage.place_of_death,
        occupation: baseOfPage.occupation,
        ethnicity: baseOfPage.ethnicity,
        relationToUser: baseOfPage.relation_to_user,
        sex: baseOfPage.sex,
        uncertainFirstName: baseOfPage.uncertain_first_name,
        uncertainMiddleName: baseOfPage.uncertain_middle_name,
        uncertainLastName: baseOfPage.uncertain_last_name,
        uncertainBirthDate: baseOfPage.uncertain_birth_date,
        uncertainBirthPlace: baseOfPage.uncertain_birth_place,
        uncertainDeathDate: baseOfPage.uncertain_death_date,
        uncertainDeathPlace: baseOfPage.uncertain_death_place,
        uncertainOccupation: baseOfPage.uncertain_occupation,
        memberOfNobility: baseOfPage.member_of_nobility,
      });
    } catch (error) {
      console.log("Error getting page number:", error);
      res.status(500).json({ error: "Error fetching page data" });
    }
  };