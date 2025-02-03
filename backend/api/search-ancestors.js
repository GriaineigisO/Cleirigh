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
  console.log("API TRIGGERED")
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
    const {
      userId,
      firstName,
      middleName,
      lastName,
      birthDate,
      birthPlace,
      deathDate,
      deathPlace,
      ethnicity,
      profileNum,
    } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    let query = supabase.from(`tree_${currentTree}`).select("*"); // Fetch all columns

    if (firstName) query = query.eq("first_name", firstName);
    if (middleName) query = query.eq("middle_name", middleName);
    if (lastName) query = query.eq("last_name", lastName);
    if (birthDate) query = query.eq("date_of_birth", birthDate);
    if (birthPlace) query = query.ilike("place_of_birth", `%${birthPlace}%`);
    if (deathDate) query = query.eq("date_of_death", deathDate);
    if (deathPlace) query = query.ilike("place_of_death", `%${deathPlace}%`);
    if (ethnicity) query = query.eq("ethnicity", ethnicity);
    if (profileNum && profileNum !== 0)
      query = query.eq("ancestor_id", profileNum);

    const { data, error } = await query;

    const resultsArray = data;
    console.log(resultsArray)

    res.json(resultsArray);
  } catch (error) {
    console.log("error searching ancestors:", error);
  }
}
