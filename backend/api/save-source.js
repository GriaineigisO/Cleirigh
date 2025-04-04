import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      corsOptions.methods.join(", ")
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      corsOptions.allowedHeaders.join(", ")
    );

    // Handle OPTIONS method for CORS preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      userId,
      sourceNameLink,
      sourceLink,
      sourceNameText,
      sourceNameTextAuthor,
      profileData,
    } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    const { data: addSources, error } = await supabase.from("sources").insert([
      {
        tree_id: currentTree,
        ancestor_id: profileData.ancestor_id,
        source_link_name: sourceNameLink,
        source_link: sourceLink,
        source_text_name: sourceNameText,
        source_text_author: sourceNameTextAuthor,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }

    res.json(true);
  } catch (error) {
    console.log("Error saving source link:", error);
  }
}
