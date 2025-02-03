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
  console.log("API triggerred")
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
      const { userId, personID, sex } = req.body;
  
      // Get the current tree ID for the user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = user.current_tree_id;
  
      // Remove any mention of the person's ID in anyone else's father_id or mother_id
      if (sex === "male") {
        const { error: maleUpdateError } = await supabase
          .from(`tree_${currentTree}`)
          .update({ father_id: null })
          .eq('father_id', personID);
  
        if (maleUpdateError) {
          throw new Error(maleUpdateError.message);
        }
      } else {
        const { error: femaleUpdateError } = await supabase
          .from(`tree_${currentTree}`)
          .update({ mother_id: null })
          .eq('mother_id', personID);
  
        if (femaleUpdateError) {
          throw new Error(femaleUpdateError.message);
        }
      }
  
      // Delete recursively if the person has no children linked as father_id or mother_id
      const deleteRecursively = async (ID, personSex) => {
        // Find the parents of the given person
        const { data: person, error: personError } = await supabase
          .from(`tree_${currentTree}`)
          .select('father_id, mother_id')
          .eq('ancestor_id', ID)
          .single();
  
        if (personError) {
          throw new Error(personError.message);
        }
  
        const { father_id: fatherID, mother_id: motherID } = person;
  
        let hasChildren = false;
  
        // Determine if the person is listed as the parent for any children
        if (personSex === "male") {
          const { data: children, error: childrenError } = await supabase
            .from(`tree_${currentTree}`)
            .select('ancestor_id')
            .eq('father_id', ID);
  
          if (childrenError) {
            throw new Error(childrenError.message);
          }
  
          if (children.length > 0) {
            hasChildren = true;
          }
        } else {
          const { data: children, error: childrenError } = await supabase
            .from(`tree_${currentTree}`)
            .select('ancestor_id')
            .eq('mother_id', ID);
  
          if (childrenError) {
            throw new Error(childrenError.message);
          }
  
          if (children.length > 0) {
            hasChildren = true;
          }
        }
  
        // Only delete if no children are associated
        if (!hasChildren) {
          // Perform the deletion of the ancestor
          const { error: deleteError } = await supabase
            .from(`tree_${currentTree}`)
            .delete()
            .eq('ancestor_id', ID);
  
          if (deleteError) {
            throw new Error(deleteError.message);
          }
  
          // Recursively delete parents if no children exist and the person is deleted
          if (fatherID) {
            await deleteRecursively(fatherID, "male");
          }
          if (motherID) {
            await deleteRecursively(motherID, "female");
          }
        }
      };
  
      // Start the recursive deletion process for the person
      await deleteRecursively(personID, sex);
  
      res.json({ message: "Person and ancestors deleted successfully" });
  
    } catch (error) {
      console.log("Error deleting person:", error);
      res.status(500).json({ error: "Error deleting person" });
    }
  };