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

    // Fetch ancestor data in batches
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

    const memoizedResults = {};

    async function calculateInbreedingCoefficient(personId, path = []) {
      if (memoizedResults[personId]) {
        return memoizedResults[personId];
      }
    
      const person = ancestorLookup[personId];
    
      // If the person doesn't exist, return 0 (i.e., no inbreeding)
      if (!person) {
        memoizedResults[personId] = 0;
        return 0;
      }
    
      // Check for loops (to avoid infinite recursion)
      if (path.includes(personId)) {
        memoizedResults[personId] = 0;
        return 0;
      }
    
      // If there are no parents, return 0 (i.e., dead end)
      if (!person.father_id && !person.mother_id) {
        memoizedResults[personId] = 0;
        return 0;
      }
    
      let commonCoEff = 0;
    
      // If both father and mother exist, check for common ancestors
      if (person.father_id && person.mother_id) {
        const commonAncestors = findCommonAncestors(person.father_id, person.mother_id, path);
    
        // For each common ancestor, calculate their contribution to the inbreeding coefficient
        for (const { ancestorId, fatherSteps, motherSteps } of commonAncestors) {
          // Skip ancestors that have already been processed in this path
          if (path.includes(ancestorId)) continue;
    
          const sharedAncestor = ancestorLookup[ancestorId];
          const F_CA =
            sharedAncestor?.father_id && sharedAncestor?.mother_id
              ? await calculateInbreedingCoefficient(ancestorId, [...path, personId])
              : 0;
    
          let n = fatherSteps + motherSteps; // Total steps to the common ancestor
    
          // We adjust how the common ancestor's contribution is calculated to account for both sides
          commonCoEff += Math.pow(0.5, n) * (1 + F_CA);
        }
      }
    
      // Calculate inbreeding coefficient from the parents (taking into account the parent's inbreeding)
      const fatherCoEff = person.father_id
        ? await calculateInbreedingCoefficient(person.father_id, [...path, personId])
        : 0;
    
      const motherCoEff = person.mother_id
        ? await calculateInbreedingCoefficient(person.mother_id, [...path, personId])
        : 0;
    
      // Total coefficient considering both parents' contributions and the common ancestors
      const totalCoEff = commonCoEff + fatherCoEff / 2 + motherCoEff / 2;
    
      // Memoize the result
      memoizedResults[personId] = totalCoEff;
    
      return totalCoEff;
    }
    
    function findCommonAncestors(fatherId, motherId, path = []) {
      const ancestors1 = getAncestorSteps(fatherId, path);
      const ancestors2 = getAncestorSteps(motherId, path);
    
      const commonAncestors = [];
    
      for (const ancestorId in ancestors1) {
        if (ancestorId in ancestors2) {
          // Only add ancestors that haven't already been processed in the current path
          if (!path.includes(ancestorId)) {
            const fatherSteps = ancestors1[ancestorId];
            const motherSteps = ancestors2[ancestorId];
    
            commonAncestors.push({
              ancestorId: Number(ancestorId),
              fatherSteps,
              motherSteps,
            });
          }
        }
      }
    
      return commonAncestors;
    }
    
    function getAncestorSteps(personId, path = [], seen = {}) {
      const person = ancestorLookup[personId];
      if (!person) return {};
    
      const result = {};
    
      if (
        person.father_id &&
        !seen[person.father_id] &&
        ancestorLookup[person.father_id]
      ) {
        seen[person.father_id] = true;
        result[person.father_id] = path.length + 1;
        Object.assign(
          result,
          getAncestorSteps(person.father_id, [...path, personId], seen)
        );
      }
    
      if (
        person.mother_id &&
        !seen[person.mother_id] &&
        ancestorLookup[person.mother_id]
      ) {
        seen[person.mother_id] = true;
        result[person.mother_id] = path.length + 1;
        Object.assign(
          result,
          getAncestorSteps(person.mother_id, [...path, personId], seen)
        );
      }
    
      return result;
    }
    


    const coefficient = await calculateInbreedingCoefficient(id);
    const inbreedingPercentage = coefficient * 100;
    console.log(`Inbreeding Coefficient: ${inbreedingPercentage}%`);
    console.log(`Raw Inbreeding Coefficient: ${coefficient}`);

    function getInterpretation(coefficient) {
      // Define central values for each cousin category
      const thresholds = [
        { value: 0, interpretation: "completely unrelated" },
        { value: 0.2, interpretation: "fourth cousins" },
        { value: 0.78, interpretation: "third cousins" },
        { value: 3.13, interpretation: "second cousins" },
        { value: 12.5, interpretation: "first cousins" },
        { value: 25, interpretation: "aunt/uncle and niece/nephew, or half siblings, or grandparent and grandchildren, or double first cousins" },
        { value: 50, interpretation: "full siblings, or parent and child" }
      ];
    
      // Find the threshold with the minimum difference to the given coefficient
      let closest = thresholds[0];
      let minDiff = Math.abs(coefficient - closest.value);
    
      thresholds.forEach(threshold => {
        const diff = Math.abs(coefficient - threshold.value);
        if (diff < minDiff) {
          minDiff = diff;
          closest = threshold;
        }
      });
    
      return closest.interpretation;
    }
    
    res.json({
      inbreedingCoefficient: inbreedingPercentage,
      interpretation: getInterpretation(inbreedingPercentage),
    });
  } catch (error) {
    console.log("error calculating inbreeding coefficient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
