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
      const getCurrentTreeId = await pool.query(
        "SELECT current_tree_id FROM users WHERE id = $1",
        [userId]
      );
  
      const currentTree = getCurrentTreeId.rows[0].current_tree_id;
      
      // Query to get the current page
      const getCurrentPage = await pool.query(
        "SELECT current_page FROM users WHERE id = $1",
        [userId]
      );
  
      const currentPage = getCurrentPage.rows[0].current_page;
  
      const getLeftNote = await pool.query(`
        SELECT * FROM notes 
        WHERE tree_id = $1 AND page_number = $2
      `, [
        currentTree,
        currentPage,
      ])
  
      if (getLeftNote.rows.length > 0) {
  
        const leftNote = getLeftNote.rows[0].left_note
        const leftNoteHeadline = getLeftNote.rows[0].left_note_headline
  
        let bool = true;
        if (leftNote === null) {
          bool = false;
        }
  
        res.json({
          isLeftNote: bool,
          leftNote: leftNote,
          leftNoteHeadline:leftNoteHeadline
        });
  
    } else {
      res.json({
        isLeftNote: false,
        leftNote: null,
        leftNoteHeadline:null
      });
    }
    
  
    } catch(error) {
      console.log("Error saving left note:", error)
    }
  }