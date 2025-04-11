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

    const memo = {};

    function calculateInbreedingCoefficient(personId, path = []) {
      const person = ancestorLookup[personId];

      console.log(".......................")
      console.log("Person:", person)

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
          const n = fatherSteps + motherSteps; // Total steps (generations) from common ancestor to the person
          const F_CA = calculateInbreedingCoefficient(ancestorId, [
            ...path,
            personId,
          ]); //coefficient of the common ancestor himself

          // Adding the common ancestor's contribution to the inbreeding coefficient
          commonCoEff += Math.pow(0.5, n) * (1 + F_CA); // Formula for inbreeding coefficient contribution
          console.log(
            `Common Ancestor ${ancestorId}: ${commonCoEff} (steps: ${fatherSteps} + ${motherSteps})`
          );
          console.log(
            `CommonAncestors: ${commonAncestors})`
          );
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

      if (personId === id) {
        console.log("fatherCoEff:", fatherCoEff);
        console.log("motherCoEff:", motherCoEff);
        console.log("totalCoEff:", totalCoEff);
      }

      return totalCoEff;
    }

    function findCommonAncestors(fatherId, motherId) {
  const ancestors1 = getAncestorSteps(fatherId);
  const ancestors2 = getAncestorSteps(motherId);

  const commonAncestors = [];

  for (const ancestorId in ancestors1) {
    if (ancestorId in ancestors2) {
      const ancestorInbreeding = calculateInbreedingCoefficient(Number(ancestorId));

      // Allow non-inbred ancestors to contribute, even if their coefficient is 0
      commonAncestors.push({
        ancestorId: Number(ancestorId),
        fatherSteps: ancestors1[ancestorId],
        motherSteps: ancestors2[ancestorId],
        inbreedingCoefficient: ancestorInbreeding,
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

    function flattenAncestors(tree, steps = 1, flat = {}) {
      for (const [personId, parentTree] of Object.entries(tree)) {
        if (!flat[personId]) flat[personId] = [];
        flat[personId].push(steps);

        if (parentTree.father) {
          flattenAncestors(parentTree.father, steps + 1, flat);
        }
        if (parentTree.mother) {
          flattenAncestors(parentTree.mother, steps + 1, flat);
        }
      }
      return flat;
    }

    const coefficient = calculateInbreedingCoefficient(id);
    console.log(`Inbreeding Coefficient: ${coefficient * 100}%`);

    function getInterpretation(coefficient) {
      if (coefficient === 0) return "No detectable inbreeding";
      if (coefficient < 0.1)
        return "Very distant relatives (e.g., 6th cousins or more)";
      if (coefficient < 0.5) return "Distant relatives (e.g., 4th-5th cousins)";
      if (coefficient < 1) return "3rd-4th cousins";
      if (coefficient < 2) return "2nd-3rd cousins";
      if (coefficient < 6) return "1st-2nd cousins";
      if (coefficient < 13) return "Siblings or parent-child";
      if (coefficient < 25) return "Double first cousins or uncle-niece";
      return "Very close relationship (e.g., sibling or parent-child repeated)";
    }

    res.json({
      inbreedingCoefficient: coefficient * 100,
      interpretation: getInterpretation(coefficient * 100),
    });
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
