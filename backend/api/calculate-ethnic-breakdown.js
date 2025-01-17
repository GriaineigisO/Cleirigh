import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// CORS options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
 
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
    res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

    // Handle OPTIONS request for CORS preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    try {
      const { userId, id } = req.body;
  
      // Get the current tree ID from the user's record
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('current_tree_id')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      const currentTree = user.current_tree_id;
  
      //recursive function which determines the parent's ethnic breakdown. It first must gain the values of each deadend ancestor (hence continiously checking if a person has parents, going up one generation if he does)
      const ethnicityCache = new Map();

const calculateEthnicBreakdown = async (childId) => {
  let ethnicityNameArray = [];
  let ethnicityPercentageArray = [];

  // Check if the ancestor's ethnicity is already cached
  if (ethnicityCache.has(childId)) {
    return ethnicityCache.get(childId);
  }

  const { data: findParents } = await supabase
    .from(`tree_${currentTree}`)
    .select('*')
    .eq('ancestor_id', childId);

  const fatherId = findParents[0].father_id;
  const motherId = findParents[0].mother_id;

  if (fatherId === null && motherId === null) {
    ethnicityNameArray.push(findParents[0].ethnicity);
    ethnicityPercentageArray.push(100);
    const ethnicityData = [ethnicityNameArray, ethnicityPercentageArray];
    ethnicityCache.set(childId, ethnicityData); // Cache the result
    return ethnicityData;
  }

  // Use Promise.all for concurrent father and mother processing
  const [fatherEthnicity, motherEthnicity] = await Promise.all([
    fatherId !== null ? calculateEthnicBreakdown(fatherId) : [[], []],
    motherId !== null ? calculateEthnicBreakdown(motherId) : [[], []],
  ]);

  for (let i = 0; i < fatherEthnicity[0].length; i++) {
    ethnicityNameArray.push(fatherEthnicity[0][i]);
    ethnicityPercentageArray.push(fatherEthnicity[1][i] / 2);
  }

  for (let i = 0; i < motherEthnicity[0].length; i++) {
    if (ethnicityNameArray.includes(motherEthnicity[0][i])) {
      const idx = ethnicityNameArray.indexOf(motherEthnicity[0][i]);
      ethnicityPercentageArray[idx] += motherEthnicity[1][i] / 2;
    } else {
      ethnicityNameArray.push(motherEthnicity[0][i]);
      ethnicityPercentageArray.push(motherEthnicity[1][i] / 2);
    }
  }

  const ethnicityData = [ethnicityNameArray, ethnicityPercentageArray];
  ethnicityCache.set(childId, ethnicityData); // Cache the result

  return ethnicityData;
};

      
  
      //initial call, with the target ancestor's ID in the argument
      const ethnicity = await calculateEthnicBreakdown(id);
  
      res.json({
        ethnicityNameArray: ethnicity[0],
        ethnicityPercentageArray: ethnicity[1],
      });
    } catch (error) {
      console.log("error calculating ethnic breakdown:", error);
    }
  };