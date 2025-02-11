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
      const childId = stack.pop();

      if (ethnicityMap.has(childId)) continue;

      // Query to find parents of the current ancestor
      const { data: findParents, error: findParentsError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", childId);

      if (findParents.length === 0) continue;

      const row = findParents[0];
      const { father_id: fatherId, mother_id: motherId, ethnicity } = row;

      // If both father and mother are unknown, the ancestor is a dead-end
      if (fatherId === null && motherId === null) {
        // Assign full ethnicity to dead-end ancestor
        ethnicityMap.set(childId, { [ethnicity]: 100 });
      } else {
        // Check if we need to process the parents
        if (fatherId && !ethnicityMap.has(fatherId)) {
          stack.push(fatherId);
          continue;
        }
        if (motherId && !ethnicityMap.has(motherId)) {
          stack.push(motherId);
          continue;
        }

        // Calculate ethnicity for this ancestor by averaging the ethnicities of the parents
        const childEthnicity = {};

        const processParent = (parentId) => {
          if (parentId !== null) {
            const parentEthnicity = ethnicityMap.get(parentId) || {};
            for (const [ethnicity, percentage] of Object.entries(parentEthnicity)) {
              if (childEthnicity[ethnicity] === undefined) {
                childEthnicity[ethnicity] = percentage / 2;
              } else {
                childEthnicity[ethnicity] += percentage / 2;
              }
            }
          }
        };

        // Process both parents' ethnicities if available
        processParent(fatherId);
        processParent(motherId);

        // Store the calculated ethnicity for the current ancestor
        ethnicityMap.set(childId, childEthnicity);
      }
    }

    // Find the final ethnicity data for the given ID
    const resultEthnicity = ethnicityMap.get(Number(id)) || {};

    res.json({
      ethnicityNameArray: Object.keys(resultEthnicity),
      ethnicityPercentageArray: Object.values(resultEthnicity),
    });
  } catch (error) {
    console.log("Error calculating ethnic breakdown:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
