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
      const { userId, personID, pageNumFromParams } = req.body;

      const pageNumber = Number(pageNumFromParams);
  
      // Get the current tree ID from the user's record
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = user.current_tree_id;
  
      // Get the maximum page number and increment it by 1
      const { data: maxPageData, error: pageError } = await supabase
        .from(`tree_${currentTree}`)
        .select('page_number')
        .order('page_number', { ascending: false })
        .limit(1)
        .single();
  
      if (pageError) {
        throw new Error(pageError.message);
      }
  
      const newPageNum = maxPageData ? Number(maxPageData.page_number) + 1 : 1;
  
      // Update the page number and set it as the base for the new page
      const { error: updateError1 } = await supabase
        .from(`tree_${currentTree}`)
        .update({ page_number: newPageNum, base_of_page: newPageNum })
        .eq('ancestor_id', personID);
  
      if (updateError1) {
        throw new Error(updateError1.message);
      }
  
      // Update the previous_page reference for the person
      const { error: updateError2 } = await supabase
        .from(`tree_${currentTree}`)
        .update({ previous_page: pageNumber })
        .eq('ancestor_id', personID);
  
      if (updateError2) {
        throw new Error(updateError2.message);
      }
  
      res.json({ success: true, newPageNum });
    } catch (error) {
      console.log("Error making new page: ", error);
      res.status(500).json({ error: "Error making new page" });
    }
  };
  