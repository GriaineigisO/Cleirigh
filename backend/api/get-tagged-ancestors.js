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
    const { userId, topicId } = req.body;

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
      .eq("id", topicId);

    const taggedAncestors = data.map((topic) => topic.tagged_ancestors);
    let taggedAncestorsNames = [];

    console.log(`taggedAncestors: ${taggedAncestors}`)
    console.log(`taggedAncestors.length: ${taggedAncestors.length}`)

    for (let i = 0; i < taggedAncestors.length; i++) {
        console.log(`taggedAncestors[i]: ${taggedAncestors[i]}`)
      const { data: findNames, error: findNamesError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", taggedAncestors[i])
        .single();

      
     if (!findNames) {
        console.log(findNamesError)
     }

      let fullName = "";
      let middleName = "";
      let lastName = "";
      if (findNames.middle_name !== null) {
        middleName = findNames.middle_name;
      }
      if (findNames.last_name !== null) {
        lastName = findNames.last_name;
      }

      fullName = findNames.first_name + middleName + lastName;

      taggedAncestorsNames.push(fullName);
    }

    res.json({
      taggedAncestors: taggedAncestors,
      taggedAncestorsNames: taggedAncestorsNames
    });
  } catch (error) {
    console.log("Error editing right note:", error);
  }
}
