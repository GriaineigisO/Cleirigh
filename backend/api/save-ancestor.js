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
    const { userId, ancestorDetails, childID, sex } = req.body;
    console.log(ancestorDetails);

    // Query to get the current tree id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const currentTree = user.current_tree_id;

    // Query to get all ancestor ids
    const { data: ancestors, error: ancestorError } = await supabase
      .from(`tree_${currentTree}`)
      .select("ancestor_id");

    if (ancestorError) {
      throw new Error(ancestorError.message);
    }

    const allAncestorIds = ancestors.map((row) => row.ancestor_id);

    // Generate a random ancestor_id, ensuring no duplication
    let ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    while (allAncestorIds.includes(ancestor_id)) {
      ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    }

    // Update father_id or mother_id depending on sex
    if (sex === "male") {
      const { error: childError } = await supabase
        .from(`tree_${currentTree}`)
        .update({ father_id: ancestor_id })
        .eq("ancestor_id", childID);

      if (childError) {
        throw new Error(childError.message);
      }
    } else if (sex === "female") {
      const { error: childError } = await supabase
        .from(`tree_${currentTree}`)
        .update({ mother_id: ancestor_id })
        .eq("ancestor_id", childID);

      if (childError) {
        throw new Error(childError.message);
      }
    }

    // Fetch the page number of the child
    const { data: pageData, error: pageError } = await supabase
      .from(`tree_${currentTree}`)
      .select("page_number")
      .eq("ancestor_id", childID)
      .single();

    if (pageError) {
      throw new Error(pageError.message);
    }

    const page_number = Number(pageData ? pageData.page_number : 0); // Default to 0 if not found

    // Retrieve relation_to_user for the ancestor
    const { data: relationData, error: relationError } = await supabase
      .from(`tree_${currentTree}`)
      .select("relation_to_user")
      .eq("ancestor_id", childID)
      .single();

    if (relationError) {
      throw new Error(relationError.message);
    }

    const ancestorRelation = relationData.relation_to_user.map(
      (rel) => rel + 1
    );

    if (sex === "male") {
      const { data: findChild, error: findChildError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("father_id", ancestorDetails.id);
    } else {
      const { data: findChild, error: findChildError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("mother_id", ancestorDetails.id);
    }

    //update child's presumed birth place if necessary. If there are generations of people with no birth place and no presumed birth place and the new ancestor has a birth place, this birthplace will be recursively assigned as the presumed birthplace of each descendant who lacks a birthplace
    const recursivelyUpdateChildsPresumedBirthPlace = async (
      parentBirthPlace,
      childBirthPlace,
      parentId,
      childId,
      childsPresumedBirthPlace,
      parentGender,
      childGender
    ) => {
      //if parent has no birth place, or if the child already has a birth place or presumed birth place, change nothing andend function immediately
      if (!parentBirthPlace || childBirthPlace || childsPresumedBirthPlace) {
        console.log("no need to change info")
        return;
      }

      console.log("adding presumed birth place...")

      //check if parent is male or female
      if (parentGender === "male") {
        const { data: findChild, error: findChildError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("father_id", parentId);

          console.log("child is", findChild.ancestor_id)

        const {
          data: updatedPresumedBirthPlace,
          error: updatedPresumedBirthPlaceError,
        } = await supabase
          .from(`tree_${currentTree}`)
          .update({ presumed_place_of_birth: parentBirthPlace })
          .eq("ancestor_id", childId);

          console.log("child new presumed birth place has been updated")

        //now find the child's child
        if (childGender === "male") {
          const { data: findChildChild, error: findChildChildError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("father_id", childId);
          //recursively call function if child has a child
          if (findChildChild) {
            recursivelyUpdateChildsPresumedBirthPlace(
              parentBirthPlace,
              findChildChild.place_of_birth,
              childId,
              findChildChild.ancestor_id,
              findChildChild.presumed_place_of_birth
            );
          }
        } else {
          const { data: findChildChild, error: findChildChildError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("mother_id", childId);
          //recursively call function if child has a child
          if (findChildChild) {
            recursivelyUpdateChildsPresumedBirthPlace(
              parentBirthPlace,
              findChildChild.place_of_birth,
              childId,
              findChildChild.ancestor_id,
              findChildChild.presumed_place_of_birth
            );
          }
        }
      } else {
        const { data: findChild, error: findChildError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("father_id", parentId);

        const {
          data: updatedPresumedBirthPlace,
          error: updatedPresumedBirthPlaceError,
        } = await supabase
          .from(`tree_${currentTree}`)
          .update({ presumed_place_of_birth: parentBirthPlace })
          .eq("ancestor_id", childId);

        //now find the child's child
        if (childGender === "male") {
          const { data: findChildChild, error: findChildChildError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("father_id", childId);
          //recursively call function if child has a child
          if (findChildChild) {
            recursivelyUpdateChildsPresumedBirthPlace(
              parentBirthPlace,
              findChildChild.place_of_birth,
              childId,
              findChildChild.ancestor_id,
              findChildChild.presumed_place_of_birth
            );
          }
        } else {
          const { data: findChildChild, error: findChildChildError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("mother_id", childId);
          //recursively call function if child has a child
          if (findChildChild) {
            recursivelyUpdateChildsPresumedBirthPlace(
              parentBirthPlace,
              findChildChild.place_of_birth,
              childId,
              findChildChild.ancestor_id,
              findChildChild.presumed_place_of_birth
            );
          }
        }
      }
    };

    recursivelyUpdateChildsPresumedBirthPlace(
      ancestorDetails.birthPlace,
      findChild.place_of_birth,
      ancestor_id,
      findChild.ancestor_id,
      findChild.presumed_place_of_birth
    );

    // Insert the new ancestor into the tree
    const { error: insertError } = await supabase
      .from(`tree_${currentTree}`)
      .insert([
        {
          first_name: ancestorDetails.firstName,
          middle_name: ancestorDetails.middleName,
          last_name: ancestorDetails.lastName,
          ancestor_id: ancestor_id,
          page_number: page_number,
          base_person: false,
          sex: sex,
          ethnicity: ancestorDetails.ethnicity,
          date_of_birth: ancestorDetails.birthDate,
          place_of_birth: ancestorDetails.birthPlace,
          date_of_death: ancestorDetails.deathDate,
          place_of_death: ancestorDetails.deathPlace,
          cause_of_death: ancestorDetails.causeOfDeath,
          occupation: ancestorDetails.occupation,
          relation_to_user: ancestorRelation,
          uncertain_first_name: false,
          uncertain_middle_name: false,
          uncertain_last_name: false,
          uncertain_birth_date: false,
          uncertain_birth_place: false,
          uncertain_death_date: false,
          uncertain_death_place: false,
          uncertain_occupation: false,
          marriage_date: ancestorDetails.marriageDate,
          marriage_place: ancestorDetails.marriagePlace,
          member_of_nobility: ancestorDetails.memberOfNobility,
        },
      ]);

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Return the new ancestor_id
    res.json({ ancestor_id });
  } catch (error) {
    console.log("Error saving ancestor:", error);
    res.status(500).json({ error: "Error saving ancestor" });
  }
}
