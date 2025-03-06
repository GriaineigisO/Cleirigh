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

    // Pagination setup
    const PAGE_SIZE = 1000; // Supabase default limit per query
    let page = 0;
    let ancestors = [];
    let hasMoreData = true;

    while (hasMoreData) {
      const { data, error } = await supabase
        .from(`tree_${currentTree}`)
        .select(
          "ancestor_id, place_of_birth, father_id, mother_id, relation_to_user, first_name, middle_name, last_name, date_of_birth"
        )
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1); // Get the current page

      if (error) {
        console.error("Error fetching data:", error);
        break;
      }

      ancestors = [...ancestors, ...data]; // Add the current page of data to the ancestors array
      page++; // Move to the next page

      // If the number of rows returned is less than the page size, we're done
      if (data.length < PAGE_SIZE) {
        hasMoreData = false;
      }
    }

    console.log("Total ancestors fetched:", ancestors.length);

    // Cache for resolved birthplaces to avoid redundant lookups
    const birthplaceCache = {};

    // Function to find the closest known birthplace
    // Cache ancestors by ancestor_id for quick lookup
    const ancestorsMap = ancestors.reduce((acc, ancestor) => {
      acc[ancestor.ancestor_id] = ancestor;
      return acc;
    }, {});

    const getBirthPlace = (id) => {
      if (!id) {
        console.log(`Invalid ID passed: ${id}`);
        return null; // Ensure valid ID
      }

      const current = ancestorsMap[id]; // Get ancestor by ancestor_id

      if (!current) {
        console.log(`No ancestor found with ID: ${id}`);
        return null; // No ancestor found for the given ID
      }

      // If ancestor has no place of birth listed, look for parents
      if (!current.place_of_birth) {
        console.log(
          `No birthplace for ancestor with ID: ${id}. Trying parents...`
        );

        // Try father first, then mother
        if (current.father_id) {
          return getBirthPlace(current.father_id); // Try father
        }

        if (current.mother_id) {
          return getBirthPlace(current.mother_id); // Try mother
        }

        return null; // No birthplace found even with parents
      }

      return current.place_of_birth;
    };

    // Function to format the name
    const formatName = (first, middle, last) => {
      if (!first) first = "Unknown"; // Only set to Unknown if first name is missing
      if (!middle) middle = ""; // Middle name can be empty
      if (!last) last = ""; // Last name can be empty
      return `${first} ${middle} ${last}`;
    };

    // Process each child and assign missing birthplaces
    Object.values(ancestors).forEach((child) => {
      if (!child.place_of_birth && !child.presumed_place_of_birth) {
        console.log("no birth place nor presumed place for", child.ancestor_id)
        child.place_of_birth = null;
      } else if (!child.place_of_birth && child.presumed_place_of_birth) {
        child.place_of_birth = child.presumed_place_of_birth;
        console.log(
          `Presumed birthplace for ${child.ancestor_id}: ${child.place_of_birth}`
        );
      };
    });

    // Create migration arrows for parents
    const validPairs = Object.values(ancestors).flatMap((child) => {
      const migrations = [];

      let fatherId = child.father_id;

      if (
        child.father_id &&
        ancestors[child.father_id]?.place_of_birth !== child.place_of_birth
      ) {
        console.log("father's details", ancestors.fatherId)
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

    return res.json(validPairs);
  } catch (error) {
    console.error("Error processing parent-child migrations:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
