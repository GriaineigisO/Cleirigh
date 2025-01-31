import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", 
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

    const { userId, tag, ancestorId } = req.body;

    console.log(`userId: ${userId}`)
    console.log(`tag: ${tag}`)
    console.log(`ancestorId: ${ancestorId}`)
  
    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    const currentTree = user.current_tree_id;

    // Get existing tagged ancestors array
    const { data: getPreviousTaggedAncestorArray, error: tagError } = await supabase
      .from("topics")
      .select("tagged_ancestors")
      .eq("id", tag)
      .eq("tree_id", currentTree)
      .single(); // Only expecting one row

    if (tagError) {
      console.log(tagError.message);
    }

    let taggedAncestorsArray = getPreviousTaggedAncestorArray?.tagged_ancestors || [];

    // Check if ancestorId is already in the array before pushing
    if (!taggedAncestorsArray.includes(ancestorId)) {
      taggedAncestorsArray.push(ancestorId);
    }

    // Update the tagged_ancestors array in the database
    const { data, error } = await supabase
      .from("topics")
      .update({ tagged_ancestors: taggedAncestorsArray })
      .eq("id", tag)
      .eq("tree_id", currentTree);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Respond with success
    res.json(true);

  } catch (error) {
    console.log("Error saving tags: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
