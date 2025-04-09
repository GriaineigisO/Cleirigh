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
        if (!person) return 0;
        if (path.includes(personId)) return 0;
        if (!person.father_id && !person.mother_id) return 0;
  
        let commonCoEff = 0;
  
        if (person.father_id && person.mother_id) {
          const commonAncestors = findCommonAncestors(person.father_id, person.mother_id);
          console.log("Common Ancestors:", commonAncestors);
  
          for (const { ancestorId, fatherSteps, motherSteps } of commonAncestors) {
            const n = fatherSteps + motherSteps;
            const F_CA = calculateInbreedingCoefficient(ancestorId, [...path, personId]);
  
            console.log("F_CA:", F_CA);
  
            commonCoEff += Math.pow(0.5, n) * (1 + F_CA);
          }
        }
  
        const fatherCoEff = person.father_id
          ? calculateInbreedingCoefficient(person.father_id, [...path, personId])
          : 0;
  
        const motherCoEff = person.mother_id
          ? calculateInbreedingCoefficient(person.mother_id, [...path, personId])
          : 0;
  
        const totalCoEff = commonCoEff + (fatherCoEff / 2) + (motherCoEff / 2);
        console.log("Total CoEff:", totalCoEff);
  
        return totalCoEff;
      }
  
      function findCommonAncestors(personId1, personId2) {
        const ancestors1 = getAncestorSteps(personId1);
        const ancestors2 = getAncestorSteps(personId2);
  
        const commonAncestors = [];
        console.log("Ancestors 1:", ancestors1);
        console.log("Ancestors 2:", ancestors2);
  
        for (const [ancestorId, steps1] of Object.entries(ancestors1)) {
          if (ancestors2[ancestorId]) {
            const steps2 = ancestors2[ancestorId];
            for (const s1 of steps1) {
              for (const s2 of steps2) {
                commonAncestors.push({
                  ancestorId: Number(ancestorId),
                  fatherSteps: s1,
                  motherSteps: s2,
                });
              }
            }
          }
        }
  
        console.log("Found Common Ancestors:", commonAncestors);
        return commonAncestors;
      }
  
      function getAncestorSteps(personId) {
        const person = ancestorLookup[personId];
        if (!person) return {};
  
        const result = {};
  
        if (person.father_id) {
          const fatherAncestors = getAncestorSteps(person.father_id);
          Object.assign(result, fatherAncestors);
        }
  
        if (person.mother_id) {
          const motherAncestors = getAncestorSteps(person.mother_id);
          Object.assign(result, motherAncestors);
        }
  
        if (!person.father_id && !person.mother_id) {
          result[personId] = [0]; // Dead end, no parents
        }
  
        return result;
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
  
