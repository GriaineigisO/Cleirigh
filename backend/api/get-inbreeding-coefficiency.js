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

      if (error)
        return res.status(500).json({ error: "Error fetching tree data" });

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

    const memoizedResults = {};

    async function calculateInbreedingCoefficient(personId, path = []) {
      if (memoizedResults[personId] !== undefined)
        return memoizedResults[personId];

      const person = ancestorLookup[personId];
      if (!person) return (memoizedResults[personId] = 0);

      if (path.includes(personId)) return (memoizedResults[personId] = 0);

      if (!person.father_id && !person.mother_id)
        return (memoizedResults[personId] = 0);

      let commonCoEff = 0;

      if (person.father_id && person.mother_id) {
        const commonAncestors = findCommonAncestors(
          person.father_id,
          person.mother_id
        );

        for (const {
          ancestorId,
          fatherSteps,
          motherSteps,
        } of commonAncestors) {
          const sharedAncestor = ancestorLookup[ancestorId];

          let F_CA = 0;
          if (sharedAncestor?.father_id && sharedAncestor?.mother_id) {
            F_CA = await calculateInbreedingCoefficient(ancestorId, [
              ...path,
              personId,
            ]);
          }

          const n = fatherSteps + motherSteps;

          const isDirectParentOfBoth =
            (sharedAncestor?.ancestor_id ===
              ancestorLookup[person.father_id]?.father_id ||
              sharedAncestor?.ancestor_id ===
                ancestorLookup[person.father_id]?.mother_id) &&
            (sharedAncestor?.ancestor_id ===
              ancestorLookup[person.mother_id]?.father_id ||
              sharedAncestor?.ancestor_id ===
                ancestorLookup[person.mother_id]?.mother_id);

          if (F_CA > 0 || isDirectParentOfBoth) {
            commonCoEff += Math.pow(0.5, n) * (1 + F_CA);
          }
        }
      }

      const fatherCoEff = person.father_id
        ? await calculateInbreedingCoefficient(person.father_id, [
            ...path,
            personId,
          ])
        : 0;

      const motherCoEff = person.mother_id
        ? await calculateInbreedingCoefficient(person.mother_id, [
            ...path,
            personId,
          ])
        : 0;

      const totalCoEff = commonCoEff + fatherCoEff / 2 + motherCoEff / 2;

      memoizedResults[personId] = totalCoEff;
      return totalCoEff;
    }

    function findCommonAncestors(fatherId, motherId) {
      const ancestors1 = getAncestorSteps(fatherId);
      const ancestors2 = getAncestorSteps(motherId);
      const commonAncestors = [];

      for (const ancestorId in ancestors1) {
        if (ancestorId in ancestors2) {
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

    const coefficient = await calculateInbreedingCoefficient(id);
    const inbreedingPercentage = coefficient * 100;

    function getInterpretation(coefficient) {
      const thresholds = [
        { value: 0, interpretation: "completely unrelated" },
        { value: 0.2, interpretation: "fourth cousins" },
        { value: 0.78, interpretation: "third cousins" },
        { value: 3.13, interpretation: "second cousins" },
        { value: 12.5, interpretation: "first cousins" },
        {
          value: 25,
          interpretation:
            "aunt/uncle and niece/nephew, or half siblings, or grandparent and grandchild",
        },
        { value: 50, interpretation: "full siblings or parent and child" },
      ];

      let closest = thresholds[0];
      let minDiff = Math.abs(coefficient - closest.value);

      thresholds.forEach((t) => {
        const diff = Math.abs(coefficient - t.value);
        if (diff < minDiff) {
          minDiff = diff;
          closest = t;
        }
      });

      return closest.interpretation;
    }

    res.json({
      inbreedingCoefficient: inbreedingPercentage,
      interpretation: getInterpretation(inbreedingPercentage),
    });
  } catch (error) {
    console.error("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
