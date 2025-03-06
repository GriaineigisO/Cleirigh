import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const corsOptions = {
  origin: "https://cleirighgenealogy.com",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
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

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Get the user's current tree
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError || !user?.current_tree_id) {
      throw new Error(userError?.message || "User tree not found");
    }

    const currentTree = user.current_tree_id;

    // Fetch all ancestors from the tree
    const { data, error } = await supabase
      .from(`tree_${currentTree}`)
      .select(
        "ancestor_id, place_of_birth, father_id, mother_id, relation_to_user, first_name, middle_name, last_name"
      );

    if (error) throw error;

    const formatName = (first, middle, last) => {
      if (!first) {
        first = "Unknown"
      }
      if (!middle) {
        middle = "";
      }
      if (!last) {
        last = "";
      }
      return `${first} ${middle} ${last}`
    }

    // Convert to a dictionary for lookup
    const ancestors = {};
    data.forEach((person) => {
      ancestors[person.ancestor_id] = {
        id: person.ancestor_id,
        place_of_birth: person.place_of_birth,
        father_id: person.father_id,
        mother_id: person.mother_id,
        relation_to_user: person.relation_to_user,
        first_name: person.first_name,
        middle_name: person.middle_name,
        last_name: person.last_name
      };
    });

    // Cache for resolved birthplaces to avoid redundant lookups
    const birthplaceCache = {};

    // Function to find the closest known birthplace
    const getBirthPlace = (id) => {
      if (!id || !ancestors[id]) return null; // Ensure valid ID

      if (birthplaceCache[id]) return birthplaceCache[id]; // Return cached value

      let current = ancestors[id];

      while (current && !current.place_of_birth) {
        // Try father first, then mother
        current = ancestors[current.father_id] || ancestors[current.mother_id];

        if (!current) break; // If no parent exists, exit loop
      }

      const resolvedBirthplace = current?.place_of_birth || null;
      birthplaceCache[id] = resolvedBirthplace; // Cache result
      return resolvedBirthplace;
    };

    // Process each child and assign missing birthplaces
    Object.values(ancestors).forEach((child) => {
      if (!child.place_of_birth) {
        child.place_of_birth = getBirthPlace(child.id);
      }
    });

    // Create migration arrows for parents
    const validPairs = Object.values(ancestors).flatMap((child) => {
      const migrations = [];

      if (
        child.father_id &&
        ancestors[child.father_id]?.place_of_birth !== child.place_of_birth
      ) {

        migrations.push({
          parent_birth: ancestors[child.father_id]?.place_of_birth,
          parent_name: formatName(ancestors[child.father_id]?.first_name, ancestors[child.father_id]?.middle_name, ancestors[child.father_id]?.last_name),
          parent_id: ancestors[child.father_id]?.id,
          child_birth: child.place_of_birth,
          child_name: formatName(child.first_name, child.middle_name, child.last_name),
          child_id: child.id,
          relation_to_user: child.relation_to_user,
        });
      }

      if (
        child.mother_id &&
        ancestors[child.mother_id]?.place_of_birth !== child.place_of_birth
      ) {

        migrations.push({
          parent_birth: ancestors[child.mother_id]?.place_of_birth,
          parent_name: formatName(ancestors[child.mother_id]?.first_name, ancestors[child.mother_id]?.middle_name, ancestors[child.mother_id]?.last_name),
          parent_id: ancestors[child.mother_id]?.id,
          child_birth: child.place_of_birth,
          child_name: formatName(child.first_name, child.middle_name, child.last_name),
          child_id: child.id,
          relation_to_user: child.relation_to_user,
        });
      }

      return migrations;
    });
    console.log(validPairs);
    return res.json(validPairs);
  } catch (error) {
    console.error("Error processing parent-child migrations:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
