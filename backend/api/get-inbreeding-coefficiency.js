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
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, idNumber } = req.body;
    const id = idNumber;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) return res.status(500).json({ error: "Error retrieving user data" });

    const currentTree = user.current_tree_id;

    let allData = [];
    let from = 0, to = 999, done = false;

    while (!done) {
      const { data, error } = await supabase
        .from(`tree_${currentTree}`)
        .select("ancestor_id, father_id, mother_id")
        .range(from, to);

      if (error) return res.status(500).json({ error: "Error fetching tree data" });

      if (data.length > 0) {
        allData.push(...data);
        from += 1000;
        to += 1000;
      } else {
        done = true;
      }
    }

    const ancestorLookup = Object.fromEntries(allData.map((a) => [a.ancestor_id, a]));
    const memoizedResults = {};

    async function calculateInbreedingCoefficient(personId, path = []) {
      if (memoizedResults[personId] !== undefined) return memoizedResults[personId];

      const person = ancestorLookup[personId];
      if (!person || path.includes(personId)) return (memoizedResults[personId] = 0);

      const { father_id, mother_id } = person;

      if (!father_id && !mother_id) return (memoizedResults[personId] = 0);

      let commonCoEff = 0;

      if (father_id && mother_id) {
        const commonAncestors = findCommonAncestors(father_id, mother_id);

        for (const { ancestorId, fatherSteps, motherSteps } of commonAncestors) {
          const shared = ancestorLookup[ancestorId];
          const F_CA = shared?.father_id && shared?.mother_id
            ? await calculateInbreedingCoefficient(ancestorId, [...path, personId])
            : 0;

          const n = fatherSteps + motherSteps;
          commonCoEff += Math.pow(0.5, n) * (1 + F_CA);
          
      console.log(`personId: ${person}; ${commonCoEff} and ${n}`)
        }
      }

      const fatherCoEff = father_id
        ? await calculateInbreedingCoefficient(father_id, [...path, personId])
        : 0;
      const motherCoEff = mother_id
        ? await calculateInbreedingCoefficient(mother_id, [...path, personId])
        : 0;

      const totalCoEff = commonCoEff + fatherCoEff / 2 + motherCoEff / 2;


      memoizedResults[personId] = totalCoEff;
      return totalCoEff;
    }

    function findCommonAncestors(fatherId, motherId) {
      const ancestors1 = getAncestorSteps(fatherId);
      const ancestors2 = getAncestorSteps(motherId);
      const result = [];

      for (const ancestorId in ancestors1) {
        if (ancestorId in ancestors2) {
          result.push({
            ancestorId: Number(ancestorId),
            fatherSteps: ancestors1[ancestorId],
            motherSteps: ancestors2[ancestorId],
          });
        }
      }

      return result;
    }

    function getAncestorSteps(personId, steps = 1, seen = {}) {
      const result = {};
      const person = ancestorLookup[personId];
      if (!person) return result;

      for (const parentKey of ["father_id", "mother_id"]) {
        const parentId = person[parentKey];
        if (parentId && !seen[parentId] && ancestorLookup[parentId]) {
          seen[parentId] = true;
          result[parentId] = steps;
          Object.assign(result, getAncestorSteps(parentId, steps + 1, seen));
        }
      }

      return result;
    }

    const coefficient = await calculateInbreedingCoefficient(id);
    const inbreedingPercentage = coefficient * 100;

    function getInterpretation(coefficient) {
      const thresholds = [
        { value: 0, interpretation: "completely unrelated" },
        { value: 0.2, interpretation: "fourth cousins" },
        { value: 0.78, interpretation: "third cousins" },
        { value: 3.13, interpretation: "second cousins" },
        { value: 12.5, interpretation: "first cousins" },
        { value: 25, interpretation: "aunt/uncle and niece/nephew, or half siblings, or grandparent and grandchildren, or double first cousins" },
        { value: 50, interpretation: "full siblings, or parent and child" }
      ];

      let closest = thresholds[0];
      let minDiff = Math.abs(coefficient - closest.value);

      for (const t of thresholds) {
        const diff = Math.abs(coefficient - t.value);
        if (diff < minDiff) {
          minDiff = diff;
          closest = t;
        }
      }

      return closest.interpretation;
    }

    res.json({
      inbreedingCoefficient: inbreedingPercentage,
      interpretation: getInterpretation(inbreedingPercentage),
    });
  } catch (error) {
    console.error("Error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
