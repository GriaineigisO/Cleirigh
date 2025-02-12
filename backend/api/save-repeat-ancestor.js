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
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(", ")
  );

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    console.log("Processing request...");
    const { userId, childDetails, repeatAncestorId } = req.body;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) throw new Error("Failed to fetch user");
    const currentTree = user.current_tree_id;

    const { data: findSex, error: findSexError } = await supabase
      .from(`tree_${currentTree}`)
      .select("sex")
      .eq("ancestor_id", repeatAncestorId)
      .single();

    if (findSexError) throw new Error("Failed to fetch ancestor's sex");
    const sex = findSex.sex;

    const updateField = sex === "male" ? "father_id" : "mother_id";
    await supabase
      .from(`tree_${currentTree}`)
      .update({ [updateField]: repeatAncestorId })
      .eq("ancestor_id", childDetails.id);

    console.log("Starting iterative relation update...");
    let queue = [
      { child: childDetails, repeatParentId: repeatAncestorId, sex },
    ];

    while (queue.length > 0) {
      let { child, repeatParentId, sex } = queue.shift();
      let childId = child.id || child.ancestor_id;

      const { data: person, error: personError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*, father_id, mother_id, relation_to_user")
        .eq("ancestor_id", childId)
        .single();

      if (personError) continue;







      //increments child's relation_to_user by one and then assigns it to child's parent
      let repeatAncestorRelationArray = person.relation_to_user.map((num) => num + 1);
      if (sex === "male") { //determine if user descends from more than one of repeat ancestor's children

        const {data: findOtherChildren, findOtherChildrenError} = await supabase   
            .from(`tree_${currentTree}`)
            .select("*")
            .eq("father_id", repeatParentId)

        //find relation of all children, increment all by one and add to repeat ancestor's relation
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
        const {data: addNewRelationNum, addNewRelationNumError} = await supabase 
            .from(`tree_${currentTree}`)
            .update({relation_to_user: repeatAncestorRelationArray})
            .eq("ancestor_id", repeatParentId)

      } else {

        const {data: findOtherChildren, findOtherChildrenError} = await supabase 
            .from(`tree_${currentTree}`)
            .select("*")
            .eq("mother_id", repeatParentId)

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
        const {data: addNewRelationNum, addNewRelationNumError} = await supabase 
            .from(`tree_${currentTree}`)
            .update({relation_to_user: repeatAncestorRelationArray})
            .eq("ancestor_id", repeatParentId)
      }
    }

      let parents = [];
      if (person.father_id) parents.push({ id: person.father_id, sex: "male" });
      if (person.mother_id)
        parents.push({ id: person.mother_id, sex: "female" });
      console.log(parents);

      for (let parent of parents) {
        const { data: grandparent } = await supabase
          .from(`tree_${currentTree}`)
          .select("ancestor_id")
          .eq("ancestor_id", parent.id)
          .single();
        if (grandparent) {
          queue.push({
            child: parent,
            repeatParentId: grandparent.ancestor_id,
            sex: parent.sex,
          });
        }
      }
    }

    console.log("Relation update complete!");
    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
