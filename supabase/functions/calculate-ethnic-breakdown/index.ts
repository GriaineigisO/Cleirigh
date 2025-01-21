// @ts-nocheck

import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";



export default async function handler(req, res) {
  console.log("Request Received:", req.method, req.headers, req.body);
  // Initialize the Supabase client
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // CORS Configuration
const corsOptions = {
  origin: "https://cleirighgenealogy.com", 
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Set CORS headers for every request
res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

// Preflight (OPTIONS) Request Handling
if (req.method === "OPTIONS") {
  console.log("Received OPTIONS request");
  return res.status(204).end(); 
}

// Allow POST method only
if (req.method !== "POST") {
  return res.status(405).json({ error: "Method not allowed" });
}

  try {
    const { userId, id } = req.body;
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const currentTree = user.current_tree_id;

    const calculateEthnicBreakdown = async (childId) => {
      let fatherEthnicityNameArray = [];
      let fatherEthnicityPercentageArray = [];
      let motherEthnicityNameArray = [];
      let motherEthnicityPercentageArray = [];
      let ethnicityNameArray = [];
      let ethnicityPercentageArray = [];

      const { data: findParents } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .eq('ancestor_id', childId);

      const fatherId = findParents[0].father_id;
      const motherId = findParents[0].mother_id;

      if (fatherId === null && motherId === null) {
        ethnicityNameArray.push(findParents[0].ethnicity);
        ethnicityPercentageArray.push(100);
        return [ethnicityNameArray, ethnicityPercentageArray];
      }

      if (fatherId !== null && motherId === null) {
        const fatherEthnicity = await calculateEthnicBreakdown(fatherId);
        fatherEthnicity[0].forEach((ethnicityName, index) => {
          fatherEthnicityNameArray.push(ethnicityName);
          fatherEthnicityPercentageArray.push(fatherEthnicity[1][index]);
        });
        return [fatherEthnicityNameArray, fatherEthnicityPercentageArray];
      }

      if (fatherId === null && motherId !== null) {
        const motherEthnicity = await calculateEthnicBreakdown(motherId);
        motherEthnicity[0].forEach((ethnicityName, index) => {
          motherEthnicityNameArray.push(ethnicityName);
          motherEthnicityPercentageArray.push(motherEthnicity[1][index]);
        });
        return [motherEthnicityNameArray, motherEthnicityPercentageArray];
      }

      if (fatherId !== null && motherId !== null) {
        const fatherEthnicity = await calculateEthnicBreakdown(fatherId);
        fatherEthnicity[0].forEach((ethnicityName, index) => {
          fatherEthnicityNameArray.push(ethnicityName);
          fatherEthnicityPercentageArray.push(fatherEthnicity[1][index] / 2);
        });

        const motherEthnicity = await calculateEthnicBreakdown(motherId);
        motherEthnicity[0].forEach((ethnicityName, index) => {
          motherEthnicityNameArray.push(ethnicityName);
          motherEthnicityPercentageArray.push(motherEthnicity[1][index] / 2);
        });

        let childEthnicityNameArray = [];
        let childEthnicityPercentageArray = [];

        for (let i = 0; i < fatherEthnicityNameArray.length; i++) {
          childEthnicityNameArray.push(fatherEthnicityNameArray[i]);
          childEthnicityPercentageArray.push(fatherEthnicityPercentageArray[i]);
        }

        for (let i = 0; i < motherEthnicityNameArray.length; i++) {
          if (childEthnicityNameArray.includes(motherEthnicityNameArray[i])) {
            const index = childEthnicityNameArray.indexOf(motherEthnicityNameArray[i]);
            childEthnicityPercentageArray[index] += motherEthnicityPercentageArray[i];
          } else {
            childEthnicityNameArray.push(motherEthnicityNameArray[i]);
            childEthnicityPercentageArray.push(motherEthnicityPercentageArray[i]);
          }
        }

        return [childEthnicityNameArray, childEthnicityPercentageArray];
      }
    };

    const ethnicity = await calculateEthnicBreakdown(id);
    res.json({
      ethnicityNameArray: ethnicity[0],
      ethnicityPercentageArray: ethnicity[1],
    });
  } catch (error) {
    console.error("Error calculating ethnic breakdown:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
