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
    console.log("trying");
    const { userId, childDetails, repeatAncestorId } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    //adds repeat ancestor's id to his/her child's father/mother_id
    const { data: findSex, error: findSexError } = await supabase
      .from(`tree_${currentTree}`)
      .select("*")
      .eq("ancestor_id", repeatAncestorId);

    const sex = findSex[0].sex;

    console.log(sex);

    if (sex === "male") {
      const { data: addParent, error: addParentError } = await supabase
        .from(`tree_${currentTree}`)
        .update({ father_id: repeatAncestorId })
        .eq("ancestor_id", childDetails.id);
    } else {
      const { data: addParent, error: addParentError } = await supabase
        .from(`tree_${currentTree}`)
        .update({ mother_id: repeatAncestorId })
        .eq("ancestor_id", childDetails.id);
    }

    console.log("recursively updating relation");

    const recursivelyUpdateRelation = async (child, repeatParentId, sex) => {
      console.log("Recursively updating relation for child:", child);
      console.log(`repeat parent ID ${repeatParentId}`);

      let childId = "";
      if (child.id) {
        childId = child.id;
      } else {
        childId = child.ancestor_id;
      }

      console.log(childId);
      console.log("testing if this line is being read");

      //finds child
      const { data: getPerson, error: getPersonError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", childId);

      console.log(getPerson);

      if (getPersonError) {
        console.error("Error fetching user:", userError);
        return res
          .status(500)
          .json({ error: "Database error", details: userError });
      }

      const person = getPerson[0];

      console.log(person);

      //finds parents
      const { data: getFather, error: getFatherError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", person.father_id);

      if (getFatherError) {
        console.error(getFatherError);
      }

      const father = getFather[0];

      console.log(`father is next`);
      console.log(father);

      let mother = "";
      if (person.mother_id) {
        const { data: getMother, error: getMotherError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", person.mother_id);

        if (getMotherError) {
          console.error(getMotherError);
        }

        if (getMother[0]) {
          mother = getMother[0];
        }
      }

      //finds grandparents
      let pgrandfather = "";
      let pgrandmother = "";
      let mgrandfather = "";
      let mgrandmother = "";
      if (father) {
        if (father.father_id) {
          const { data: getpgrandfather, error: getpgrandfatherError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("ancestor_id", father.father_id);

          pgrandfather = getpgrandfather[0];

          console.log(`pgrandfather ${pgrandfather}`);
        }

        if (father.mother_id) {
          const { data: getpgrandmother, error: getpgrandmotherError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("ancestor_id", father.mother_id);
          pgrandmother = getpgrandmother[0];
          console.log(`pgrandmother ${pgrandmother}`);
        }
      }
      if (mother) {
        if (mother.father_id) {
          const { data: getmgrandfather, error: mgrandfatherError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("ancestor_id", mother.father_id);

          mgrandfather = getmgrandfather[0];
        }

        console.log(`mgrandfather ${mgrandfather}`);

        if (mother.mother_id) {
          const { data: getmgrandmother, error: getmgrandmotherError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("ancestor_id", mother.mother_id);
          mgrandmother = getmgrandmother[0];
          console.log(`mgrandmother ${mgrandmother}`);
        }
      }

      console.log("now to update parent's relation");
      let newRelationNum = [];
      //if the function is being called for the first time, and not in any subsequent recursive call
      if (childId === childDetails.id) {
        //increments the items child's ID relation_to_user by one
        for (let i = 0; i < person.relation_to_user.length; i++) {
          newRelationNum.push(person.relation_to_user[i] + 1);
        }

        //finds the current value of the repeat ancestor's relation_to_user
        const { data: currentValue, error: currentValueError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", repeatParentId);

        const currentRelationToUser = currentValue[0].relation_to_user;

        console.log(`parent relation to user: ${currentRelationToUser}`);

        //appends the new relation_to_user to the old ones
        for (let i = 0; i < currentRelationToUser.length; i++) {
          newRelationNum.push(currentRelationToUser[i]);
        }

        console.log("here line 155");
        //this new array is then added to the repeat ancestor's relation_to_user column
        const { data: addNewRelationNum, error: addNewRelationNumError } =
          await supabase
            .from(`tree_${currentTree}`)
            .update({ relation_to_user: newRelationNum })
            .eq("ancestor_id", repeatParentId);
      } else {
        //determine if user descends from more than one of repeat ancestor's children
        if (sex === "male") {
          const { data: findOtherChildren, error: findOtherChildrenError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("father_id", repeatParentId);

          //find relation of all children, increment all by one and add to repeat ancestor's relation
          let repeatAncestorRelationArray = [];
          for (let i = 0; i < findOtherChildren.rows.length; i++) {
            for (
              let j = 0;
              j < findOtherChildren.rows[i].relation_to_user.length;
              j++
            ) {
              repeatAncestorRelationArray.push(
                findOtherChildren.rows[i].relation_to_user[j] + 1
              );
            }
          }

          console.log("here line 185");
          //this new array is then added to the repeat ancestor's relation_to_user column
          const { data: addNewRelationNum, error: addNewRelationNumError } =
            await supabase
              .from(`tree_${currentTree}`)
              .update({ relation_to_user: repeatAncestorRelationArray })
              .eq("ancestor_id", repeatParentId);
        } else {
          const { data: findOtherChildren, error: findOtherChildrenError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("mother_id", repeatParentId);

          //find relation of all children, increment all by one and add to repeat ancestor's relation
          let repeatAncestorRelationArray = [];
          for (let i = 0; i < findOtherChildren.rows.length; i++) {
            for (
              let j = 0;
              j < findOtherChildren.rows[i].relation_to_user.length;
              j++
            ) {
              repeatAncestorRelationArray.push(
                findOtherChildren.rows[i].relation_to_user[j] + 1
              );
            }
          }
          console.log("here line 212");
          //this new array is then added to the repeat ancestor's relation_to_user column
          const { data: addNewRelationNum, error: addNewRelationNumError } =
            await supabase
              .from(`tree_${currentTree}`)
              .update({ relation_to_user: repeatAncestorRelationArray })
              .eq("ancestor_id", repeatParentId);
        }
      }

      console.log("now for recursion!");
      if (pgrandfather) {
        console.log(`pgrandfather ID: ${pgrandfather.ancestor_id}`);
        await recursivelyUpdateRelation(
          father,
          pgrandfather.ancestor_id,
          "male"
        );
      }
      if (pgrandmother) {
        await recursivelyUpdateRelation(
          father,
          pgrandmother.ancestor_id,
          "female"
        );
      }
      if (mgrandfather) {
        await recursivelyUpdateRelation(
          mother,
          mgrandfather.ancestor_id,
          "male"
        );
      }
      if (mgrandmother) {
        await recursivelyUpdateRelation(
          mother,
          mgrandmother.ancestor_id,
          "female"
        );
      }
    };

    await recursivelyUpdateRelation(childDetails, repeatAncestorId, sex);

    res.json(true);
  } catch (error) {
    console.log("Error saving repeat ancestor:", error);
  }
}
