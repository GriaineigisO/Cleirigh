import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS options
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

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, idNumber } = req.body;
    const id = idNumber;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: "Error retrieving user data" });
    }

    const currentTree = user.current_tree_id;

    let allData = [];
    let from = 0;
    let to = 999;
    let done = false;

    while (!done) {
      const { data, error } = await supabase
        .from(`tree_${currentTree}`)
        .select("ancestor_id, father_id, mother_id")
        .range(from, to);

      if (error) {
        return res.status(500).json({ error: "Error fetching tree data" });
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += 1000;
        to += 1000;
      } else {
        done = true;
      }
    }

    const ancestorLookup = allData.reduce((acc, ancestor) => {
      acc[ancestor.ancestor_id] = ancestor;
      return acc;
    }, {});

    function calculateInbreedingCoefficient(personId, path = []) {
      const person = ancestorLookup[personId];

      // If the person doesn't exist, return 0 (i.e., no inbreeding)
      if (!person) {
        return 0;
      }

      // Check for loops (to avoid infinite recursion)
      if (path.includes(personId)) {
        return 0;
      }

      // If there are no parents, return 0 (i.e., dead end)
      if (!person.father_id && !person.mother_id) {
        return 0;
      }

      let commonCoEff = 0;

      // If both father and mother exist, check for common ancestors
      if (person.father_id && person.mother_id) {
        const commonAncestors = findCommonAncestors(
          person.father_id,
          person.mother_id
        );

        // For each common ancestor, calculate their contribution to the inbreeding coefficient
        for (const {
          ancestorId,
          fatherSteps,
          motherSteps,
        } of commonAncestors) {
          const sharedAncestor = ancestorLookup[ancestorId];
          const F_CA =
            sharedAncestor?.father_id && sharedAncestor?.mother_id
              ? calculateInbreedingCoefficient(ancestorId, [...path, personId])
              : 0;
          //coefficient of the common ancestor himself

          let n = 0; // Total steps (generations) from common ancestor to the person
          if (F_CA === 0) {
            // If the shared ancestor is not inbred, reduce the inbreeding contribution
            // Scale n to a minimal value (e.g., 2), but avoid setting it too low
            n = Math.max(2, Math.min(fatherSteps, motherSteps));
          } else {
            // If the shared ancestor is inbred, include full depth from both parents
            n = Math.max(fatherSteps, motherSteps); // This helps avoid overemphasis on small steps
          }

          // Adding the common ancestor's contribution to the inbreeding coefficient
          // Apply a scaling factor to reduce impact of high n values
          commonCoEff += Math.pow(0.5, n) * (1 + F_CA);

          // Adding the common ancestor's contribution to the inbreeding coefficient
          commonCoEff += Math.pow(0.5, n) * (1 + F_CA); // Formula for inbreeding coefficient contribution
        }
      }

      // Calculate inbreeding coefficient from the parents
      const fatherCoEff = person.father_id
        ? calculateInbreedingCoefficient(person.father_id, [...path, personId])
        : 0;

      const motherCoEff = person.mother_id
        ? calculateInbreedingCoefficient(person.mother_id, [...path, personId])
        : 0;

      // Total coefficient considering both parents and common ancestors
      const totalCoEff = commonCoEff + fatherCoEff / 2 + motherCoEff / 2;

      return totalCoEff;
    }

    function findCommonAncestors(fatherId, motherId) {
      const ancestors1 = getAncestorSteps(fatherId);
      const ancestors2 = getAncestorSteps(motherId);

      const commonAncestors = [];

      for (const ancestorId in ancestors1) {
        if (ancestorId in ancestors2) {
          // Allow non-inbred ancestors to contribute, even if their coefficient is 0
          commonAncestors.push({
            ancestorId: Number(ancestorId),
            fatherSteps: ancestors1[ancestorId],
            motherSteps: ancestors2[ancestorId],
          });
        }
      }

      return commonAncestors;
    }

    function getAncestorSteps(personId, steps = 1, seen = {}) {
      const person = ancestorLookup[personId];
      if (!person) return {};

      const result = {};

      if (
        person.father_id &&
        !seen[person.father_id] &&
        ancestorLookup[person.father_id]
      ) {
        seen[person.father_id] = true;
        result[person.father_id] = steps;
        Object.assign(
          result,
          getAncestorSteps(person.father_id, steps + 1, seen)
        );
      }

      if (
        person.mother_id &&
        !seen[person.mother_id] &&
        ancestorLookup[person.mother_id]
      ) {
        seen[person.mother_id] = true;
        result[person.mother_id] = steps;
        Object.assign(
          result,
          getAncestorSteps(person.mother_id, steps + 1, seen)
        );
      }

      return result;
    }

    const coefficient = calculateInbreedingCoefficient(id);
    console.log("coefficient:", coefficient * 10)
    console.log("raw coefficient:", coefficient)


    function getInterpretation(coefficient) {
      if (coefficient === 0) return "completely unrelated";
      if (coefficient <= 0.2) return "fourth cousins";
      if (coefficient <= 0.78) return "third cousins";
      if (coefficient <= 3.13) return "second cousins";
      if (coefficient <= 12.5) return "first cousins";
      if (coefficient <= 25) return "aunt/uncle and neice/nephew, or half siblings, or grandparent and grandchildren or double first cousins";
      if (coefficient <= 50) return "full siblings, or parent and child";
    }

    res.json({
      inbreedingCoefficient: coefficient * 10,
      interpretation: getInterpretation(coefficient * 10),
    });
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}