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
    console.log("API triggered")
    const { userId, profileData } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    console.log("beginning to save info...")
    console.log("alternative names:", profileData.alternative_names)

    const {data, error}  = await supabase 
        .from(`tree_${currentTree}`)
        .update({
            first_name: profileData.first_name,
            middle_name: profileData.middle_name,
            last_name: profileData.last_name,
            place_of_birth: profileData.place_of_birth,
            date_of_birth: profileData.date_of_birth,
            place_of_death: profileData.place_of_death,
            date_of_death: profileData.date_of_death,
            cause_of_death: profileData.cause_of_death,
            ethnicity: profileData.ethnicity,
            alternative_names: profileData.alternative_names,
            occupation: profileData.occupation,
            paternal_haplogroup:  profileData.paternal_haplogroup,
            maternal_haplogroup: profileData.maternal_haplogroup,
            profile_pic_caption: profileData.ancestor_id
        })

        console.log("info saved")

  } catch (error) {
    console.log("error saving profile info:", error);
  }
}
