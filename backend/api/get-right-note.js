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
  
      const {userId, pageNum} = req.body;

      const currentPage = Number(pageNum)
  
      // Query to get the current tree
      const { data: currentTreeData, error: currentTreeError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single(); 
  
      const currentTree = currentTreeData.current_tree_id;
  
      const {data: getRightNote, error: rightNoteError} = await supabase    
        .from(`notes`)
        .select('*')
        .eq('tree_id', currentTree)
        .eq('page_number', currentPage)

        console.log(getRightNote)
  
      if (getRightNote.length > 0) {
  
        const rightNote = getRightNote[0].right_note
        const rightNoteHeadline = getRightNote[0].right_note_headline

        console.log(rightNote)
  
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
        isRightNote: false,
        rightNote: null,
        rightNoteHeadline:null
      });
    }
    
  
    } catch(error) {
      console.log("Error saving right note:", error)
    }
  }