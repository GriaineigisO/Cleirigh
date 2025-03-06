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
        "ancestor_id, place_of_birth, father_id, mother_id, relation_to_user, first_name, middle_name, last_name, date_of_birth"
      );

    if (error) throw error;

    const formatName = (first, middle, last) => {
      if (!first) first = "Unknown"; // Only set to Unknown if first name is missing
      if (!middle) middle = ""; // Middle name can be empty
      if (!last) last = ""; // Last name can be empty
      console.log("Formatted Name:", first, middle, last); // For debugging
      return `${first} ${middle} ${last}`;
    };

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
        last_name: person.last_name,
        dob: person.date_of_birth,
      };
    });

    // Cache for resolved birthplaces to avoid redundant lookups
    const birthplaceCache = {};

    // Function to find the closest known birthplace
    const getBirthPlace = (id) => {
      if (!id || !ancestors[id]) return null; // Ensure valid ID

      if (birthplaceCache[id]) return birthplaceCache[id]; // Return cached value

      let current = ancestors[id];

      //if ancestor has no place of birth listed
      while (current && !current.place_of_birth) {
        // Try father first, then mother
        current = ancestors[current.father_id] || ancestors[current.mother_id];

        if (!current) break; // If no parent exists, exit loop
      }

      const resolvedBirthplace = current?.place_of_birth || null;
      birthplaceCache[id] = resolvedBirthplace; // Cache result
      return resolvedBirthplace;
    };

    // Process each child and assign missing birthplaces. If a birth place is missing but there is a presumed birth place, use that, else, find the nearest birth place of an ancestor
    Object.values(ancestors).forEach((child) => {
      console.log("Child data:", child); // Log child data to ensure it's correct
      const father = ancestors[child.father_id];
      const mother = ancestors[child.mother_id];
      
      console.log("Father data:", father); // Log father data
      console.log("Mother data:", mother); // Log mother data


      if (!child.place_of_birth && !child.presumed_place_of_birth) {
        child.place_of_birth = getBirthPlace(child.id);
      } else if (!child.place_of_birth && child.presumed_place_of_birth) {
        child.place_of_birth = child.presumed_place_of_birth;
        console.log("presumed birth place", child.place_of_birth);
      }
    });

    // Create migration arrows for parents
    const validPairs = Object.values(ancestors).flatMap((child) => {
      const migrations = [];

      console.log("Ancestors:", ancestors); // Log the whole ancestors object

      if (
        child.father_id &&
        ancestors[child.father_id]?.place_of_birth !== child.place_of_birth
      ) {
        migrations.push({
          parent_birth: ancestors[child.father_id]?.place_of_birth,
          parent_name: formatName(
            ancestors[child.father_id]?.first_name,
            ancestors[child.father_id]?.middle_name,
            ancestors[child.father_id]?.last_name
          ),
          parent_id: ancestors[child.father_id]?.id,
          child_birth: child.place_of_birth,
          child_name: formatName(
            child.first_name,
            child.middle_name,
            child.last_name
          ),
          child_id: child.id,
          relation_to_user: child.relation_to_user,
          parent_dob: ancestors[child.father_id]?.dob,
          child_dob: child.dob,
        });
      }

      if (
        child.mother_id &&
        ancestors[child.mother_id]?.place_of_birth !== child.place_of_birth
      ) {
        migrations.push({
          parent_birth: ancestors[child.mother_id]?.place_of_birth,
          parent_name: formatName(
            ancestors[child.mother_id]?.first_name,
            ancestors[child.mother_id]?.middle_name,
            ancestors[child.mother_id]?.last_name
          ),
          parent_id: ancestors[child.mother_id]?.id,
          child_birth: child.place_of_birth,
          child_name: formatName(
            child.first_name,
            child.middle_name,
            child.last_name
          ),
          child_id: child.id,
          relation_to_user: child.relation_to_user,
          parent_dob: ancestors[child.mother_id]?.dob,
          child_dob: child.dob,
        });
      }

      return migrations;
    });
    //console.log(validPairs);
    return res.json(validPairs);
  } catch (error) {
    console.error("Error processing parent-child migrations:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
