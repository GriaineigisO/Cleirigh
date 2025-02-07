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
    const { userId, childDetails, repeatAncestorId } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    //adds repeat ancestor's id to his/her child's father/mother_id

    const { data: findSex, error } = await supabase
      .from(`tree_${currentTree}`)
      .select("*")
      .eq("ancestor_id", repeatAncestorId);

    const sex = findSex[0].sex;

    if (sex === "male") {
      const { data: addParent, error } = await supabase
        .from(`tree_${currentTree}`)
        .update({ father_id: repeatAncestorId })
        .eq("ancestor_id", childDetails.id);
    } else {
      const { data: addParent, error } = await supabase
        .from(`tree_${currentTree}`)
        .update({ mother_id: repeatAncestorId })
        .eq("ancestor_id", childDetails.id);
    }

    const recursivelyUpdateRelation = async (child, repeatParentId, sex) => {
      console.log(`recursion!`)
        console.log(childDetails)
        let childId = "";
        if (child.id) {
          childId = child.id;
        } else {
          childId = child.ancestor_id;
        }
      console.log(childId)

      //finds child
      const { data: getPerson, error } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", childId);

      const person = getPerson[0];
      //finds parents

      const { data: getFather, getFatherError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", person.father_id);

      let father = "";
      if (getFather !== null) {
        father = getFather[0];
      }

      console.log(father)

      const { data: getMother, getMotherError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", person.mother_id);

      let mother = "";
      if (getMother !== null) {
        mother = getMother[0];
      }

      //finds grandparents
      let pgrandfather = "";
      let pgrandmother = "";
      let mgrandfather = "";
      let mgrandmother = "";
      if (father) {
        const { data: getpgrandfather, getpgrandfatherError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", father.father_id);
        let pgrandfather = "";
        if (getpgrandfather !== null) {
          pgrandfather = getpgrandfather[0];
          console.log("not null!")
        } else {
          console.log("null")
        }
        console.log(pgrandfather)

        const { data: getpgrandmother, getpgrandmotherError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", father.mother_id);
        let pgrandmother = "";
        if (getpgrandmother !== null) {
          pgrandmother = getpgrandmother[0];
        }
      }
      if (mother) {
        const { data: getmgrandfather, getmgrandfatherError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", mother.father_id);
        let mgrandfather = "";
        if (getmgrandfather !== null) {
          mgrandfather = getmgrandfather[0];
        }

        const { data: getmgrandmother, getmgrandmotherError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", mother.mother_id);
        let mgrandmother = "";
        if (getmgrandmother !== null) {
          mgrandmother = getmgrandmother[0];
        }
      }

      let newRelationNum = [];
      //if the function is being called for the first time, and not in any subsequent recursive call
      if (child.id === childDetails.id) {
        //increments the items child's ID relation_to_user by one
        for (let i = 0; i < person.relation_to_user.length; i++) {
          newRelationNum.push(person.relation_to_user[i] + 1);
          console.log("item pushed!");
        }

        //finds the current value of the repeat ancestor's relation_to_user
        const { data: currentValue, currentValueError } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", repeatParentId);

        const currentRelationToUser = currentValue[0].relation_to_user;
        console.log(currentRelationToUser);

        //appends the new relation_to_user to the old ones
        for (let i = 0; i < currentRelationToUser.length; i++) {
          newRelationNum.push(currentRelationToUser[i]);
          console.log("item pushed!");
        }

        //this new array is then added to the repeat ancestor's relation_to_user column
        const { data: addNewRelationNum, addNewRelationNumError } =
          await supabase
            .from(`tree_${currentTree}`)
            .update({ relation_to_user: newRelationNum })
            .eq("ancestor_id", repeatParentId);
      } else {
        //determine if user descends from more than one of repeat ancestor's children
        if (sex === "male") {
          const { data: findOtherChildren, findOtherChildrenError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("father_id", repeatParentId);

          //find relation of all children, increment all by one and add to repeat ancestor's relation
          let repeatAncestorRelationArray = [];
          for (let i = 0; i < findOtherChildren.length; i++) {
            for (
              let j = 0;
              j < findOtherChildren[i].relation_to_user.length;
              j++
            ) {
              repeatAncestorRelationArray.push(
                findOtherChildren[i].relation_to_user[j] + 1
              );
            }
          }

          //this new array is then added to the repeat ancestor's relation_to_user column
          const { data: addNewRelationNum, addNewRelationNumError } =
            await supabase
              .from(`tree_${currentTree}`)
              .update({ relation_to_user: repeatAncestorRelationArray })
              .eq("ancestor_id", repeatParentId);
        } else {
          const { data: findOtherChildren, findOtherChildrenError } =
            await supabase
              .from(`tree_${currentTree}`)
              .select("*")
              .eq("mother_id", repeatParentId);

          //find relation of all children, increment all by one and add to repeat ancestor's relation
          let repeatAncestorRelationArray = [];
          for (let i = 0; i < findOtherChildren.length; i++) {
            for (
              let j = 0;
              j < findOtherChildren[i].relation_to_user.length;
              j++
            ) {
              repeatAncestorRelationArray.push(
                findOtherChildren[i].relation_to_user[j] + 1
              );
            }
          }

          //this new array is then added to the repeat ancestor's relation_to_user column
          const { data: addNewRelationNum, addNewRelationNumError } =
            await supabase
              .from(`tree_${currentTree}`)
              .update({ relation_to_user: repeatAncestorRelationArray })
              .eq("ancestor_id", repeatParentId);
        }
      }

      console.log(pgrandfather)
      if (pgrandfather) {
        console.log("now updating paternal grandfather")
        console.log(pgrandfather.ancestor_id)
        recursivelyUpdateRelation(father, pgrandfather.ancestor_id, "male");
      }
      if (pgrandmother) {
        recursivelyUpdateRelation(father, pgrandmother.ancestor_id, "female");
      }
      if (mgrandfather) {
        recursivelyUpdateRelation(mother, mgrandfather.ancestor_id, "male");
      }
      if (mgrandmother) {
        recursivelyUpdateRelation(mother, mgrandmother.ancestor_id, "female");
      }
    };

    recursivelyUpdateRelation(childDetails, repeatAncestorId, sex);

    res.json(true);
  } catch (error) {
    console.log("Error saving repeat ancestor:", error);
  }
}
