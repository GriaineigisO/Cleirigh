import { createClient } from "@supabase/supabase-js";

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your frontend domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(", ")
  );

  // Handle OPTIONS method (for CORS preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  try {
    const { userId, id } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const currentTree = user?.current_tree_id;

    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("tree_id", currentTree)
      .contains('tagged_ancestors', [id]);

      if (error) {
        console.error('Error fetching topics:', error);
        return res.status(500).json({ error: 'Error fetching topics' });
      }
      
      if (!data || data.length === 0) {
        console.log('No topics found.');
        res.json({ 
          topicNames: [], 
          topicLinks: [],
          topicIds: []
       });
      }

    const topicNames = data.map((topic) => topic.topic_name);
    const topicLinks = data.map((topic) => topic.topic_link);
    const topicIds = data.map((topic) => topic.id);

    res.json({ 
        topicNames: topicNames, 
        topicLinks: topicLinks,
        topicIds: topicIds
     });
  } catch (error) {
    console.log("Error editing right note:", error);
  }
}
