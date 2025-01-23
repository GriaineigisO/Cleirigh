import { createClient } from "@supabase/supabase-js";

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com",
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
    const { userId, newTopicName } = req.body;

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

    //turn topic name into topic link - replace whitespace with "_" and make everything lowercase
    const temp = newTopicName.toLowerCase();
    const topicLink = temp.replace(" ", "_");

    console.log(topicLink)

    const { data, error } = await supabase
      .from("topics")
      .insert([
        {
          tree_id: currentTree,
          topic_name: newTopicName,
          topic_link: topicLink,
        },
      ])
      .single();

    res.json(true);
  } catch (error) {
    console.log("Error editing right note:", error);
  }
}
