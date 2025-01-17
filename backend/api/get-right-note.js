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
  
      const {userId} = req.body;
  
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

      const {data: getCurrentPage, error: currentPageError } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .eq('id', userId)
  
      const currentPage = getCurrentPage[0].current_page;
  
      const {data: getRightNote, error: rightNoteError} = await supabase    
        .from(`tree_${currentTree}`)
        .select('*')
        .eq('tree_id', currentTree)
        .eq('page_number', currentPage)

      if (getRightNote.length > 0) {
  
        const rightNote = getRightNote[0].right_note
        const rightNoteHeadline = getRightNote[0].right_note_headline
  
        let bool = true;
        if (rightNote === null) {
          bool = false;
        }
  
        res.json({
          isRightNote: bool,
          rightNote: rightNote,
          rightNoteHeadline:rightNoteHeadline
        });
  
    } else {
      res.json({
        isLeftNote: false,
        leftNote: null,
        leftNoteHeadline:null
      });
    }
    
  
    } catch(error) {
      console.log("Error saving right note:", error)
    }
  }