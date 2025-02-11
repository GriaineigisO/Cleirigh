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
    const { userId, idNumber } = req.body;
    const id = idNumber;

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

    // Stack-based approach to replace recursion
    const stack = [id];
    const ethnicityMap = new Map();

    while (stack.length > 0) {
      console.log("Current stack:", stack);
      const childId = stack.pop();
      console.log("Processing childId:", childId);

      if (ethnicityMap.has(childId)) continue;

      const { data: findParents, error: findParentsError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", childId);

      if (findParents.length === 0) continue;

      const row = findParents[0];
      const { father_id: fatherId, mother_id: motherId, ethnicity } = row;

      if (fatherId === null && motherId === null) {
        // Dead-end ancestor, assign full ethnicity
        ethnicityMap.set(childId, { [ethnicity]: 100 });
      } else {
        console.log("Both parents exist, checking ethnicityMap...");
        console.log("Father ID exists in ethnicityMap?", ethnicityMap.has(fatherId));
        console.log("Mother ID exists in ethnicityMap?", ethnicityMap.has(motherId));

        if (fatherId !== null && !ethnicityMap.has(fatherId)) {
          console.log("Father not processed, adding to stack");
          stack.push(fatherId);
          continue;
        }
        if (motherId !== null && !ethnicityMap.has(motherId)) {
          console.log("Mother not processed, adding to stack");
          stack.push(motherId);
          continue;
        }

        console.log("Father's ethnicity data:", ethnicityMap.get(fatherId));
        console.log("Mother's ethnicity data:", ethnicityMap.get(motherId));

        const childEthnicity = {};
        const processParent = (parentId) => {
          if (parentId !== null) {
            const parentEthnicity = ethnicityMap.get(parentId) || {};
            console.log("Processing parent ethnicity for parentId:", parentId, parentEthnicity);
            for (const [ethnicity, percentage] of Object.entries(parentEthnicity)) {
              if (childEthnicity[ethnicity] === undefined) {
                childEthnicity[ethnicity] = percentage / 2;
              } else {
                childEthnicity[ethnicity] += percentage / 2;
              }
            }
          }
        };

        processParent(fatherId);
        processParent(motherId);

        console.log("Adding ethnicity for childId:", childId);
        console.log("Ethnicity being assigned:", childEthnicity);

        ethnicityMap.set(childId, childEthnicity);
        console.log("Updated ethnicityMap:", ethnicityMap);
      }
    }

    console.log("Final ethnicityMap:", ethnicityMap);
    console.log("Looking for id:", id);

    console.log("Available keys in ethnicityMap:", [...ethnicityMap.keys()]);
    console.log("Type of id:", typeof id);

    console.log("ethnicityMap size:", ethnicityMap.size);

    console.log("Result for id:", id, ethnicityMap.get(Number(id)));

    const resultEthnicity = ethnicityMap.get(Number(id)) || {};
    console.log("Final resultEthnicity:", resultEthnicity);

    res.json({
      ethnicityNameArray: Object.keys(resultEthnicity),
      ethnicityPercentageArray: Object.values(resultEthnicity),
    });
  } catch (error) {
    console.log("Error calculating ethnic breakdown:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
