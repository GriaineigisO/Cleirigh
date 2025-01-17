import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Memoization cache to avoid recomputing the same ancestor's ethnic breakdown
let ethnicityCache = {};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

    if (userError) throw new Error(userError.message);

    const currentTree = user.current_tree_id;

    // Helper function to fetch all parent data at once
    const getParentData = async (ancestorIds) => {
      const { data } = await supabase
        .from(`tree_${currentTree}`)
        .select('*')
        .in('ancestor_id', ancestorIds);

      return data;
    };

    const calculateEthnicBreakdown = async (childId) => {
      if (ethnicityCache[childId]) {
        return ethnicityCache[childId]; // Return cached result if already calculated
      }

      const { data: findParents } = await getParentData([childId]);

      // Check if parent data is available
      if (!findParents || findParents.length === 0) {
        throw new Error("No parent data found");
      }

      const fatherId = findParents[0].father_id;
      const motherId = findParents[0].mother_id;

      let ethnicityNameArray = [];
      let ethnicityPercentageArray = [];

      // Handle dead-end ancestors
      if (fatherId === null && motherId === null) {
        ethnicityNameArray.push(findParents[0].ethnicity);
        ethnicityPercentageArray.push(100);
      } else {
        const fatherEthnicity = fatherId ? await calculateEthnicBreakdown(fatherId) : [[], []];
        const motherEthnicity = motherId ? await calculateEthnicBreakdown(motherId) : [[], []];

        // Combine father and mother ethnicities, halving their percentages
        let childEthnicityNameArray = [...fatherEthnicity[0], ...motherEthnicity[0]];
        let childEthnicityPercentageArray = [
          ...fatherEthnicity[1].map(percentage => percentage / 2),
          ...motherEthnicity[1].map(percentage => percentage / 2)
        ];

        // Handle merging common ethnicities and summing their percentages
        childEthnicityNameArray = [...new Set(childEthnicityNameArray)];
        childEthnicityPercentageArray = childEthnicityNameArray.map((name, index) => {
          const fatherIndex = fatherEthnicity[0].indexOf(name);
          const motherIndex = motherEthnicity[0].indexOf(name);

          let percentage = 0;

          if (fatherIndex >= 0) percentage += fatherEthnicity[1][fatherIndex] / 2;
          if (motherIndex >= 0) percentage += motherEthnicity[1][motherIndex] / 2;

          return percentage;
        });

        ethnicityNameArray = childEthnicityNameArray;
        ethnicityPercentageArray = childEthnicityPercentageArray;
      }

      // Cache the result to avoid redundant calculations
      ethnicityCache[childId] = [ethnicityNameArray, ethnicityPercentageArray];

      return [ethnicityNameArray, ethnicityPercentageArray];
    };

    const ethnicity = await calculateEthnicBreakdown(id);

    res.json({
      ethnicityNameArray: ethnicity[0],
      ethnicityPercentageArray: ethnicity[1],
    });
  
  } catch (error) {
    console.log("error calculating ethnic breakdown:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
