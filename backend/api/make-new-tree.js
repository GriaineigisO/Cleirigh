import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
      // Enable CORS for all requests (including OPTIONS)
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

  // Handle OPTIONS method (for CORS preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
    try {
      const { userId, treeName, treeId } = req.body;
  
      const { data: newTree, error: treeError } = await supabase
        .from('trees')
        .insert([
          { user_id: userId, tree_name: treeName, tree_id: treeId }
        ])
        .single(); 
  
      if (treeError) {
        console.error('Error inserting new tree:', treeError);
        return res.status(500).json({ error: 'Database query failed for tree creation' });
      }
  
      // const { data: createTableData, error: createTableError } = await supabase
      //   .rpc('create_tree_table', {
      //     tree_id: treeId 
      //   });
  
      // if (createTableError) {
      //   console.error('Error creating dynamic tree table:', createTableError);
      //   return res.status(500).json({ error: 'Error creating dynamic tree table' });
      // }
  
      res.status(201).json({
        success: true,
        message: "Tree created successfully",
        tree: { treeId: newTree.tree_id },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };