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
    const { userId } = req.body;

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
      .eq("tree_id", currentTree);

    // Combine into an array of objects
    let topics = data.map((topic) => ({
      name: topic.topic_name,
      link: topic.topic_link,
      id: topic.id,
    }));

    // Sort by topic name alphabetically
    topics.sort((a, b) => a.name.localeCompare(b.name));

    const topicNames = topics.map((topic) => topic.name);
    const topicLinks = topics.map((topic) => topic.link);
    const topicIds = topics.map((topic) => topic.id);

    res.json({
      topicNames: topicNames,
      topicLinks: topicLinks,
      topicIds: topicIds,
    });
  } catch (error) {
    console.log("Error editing right note:", error);
  }
}
