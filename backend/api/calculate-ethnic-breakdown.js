import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(", ")
  );

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
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const currentTree = user.current_tree_id;

    const getParents = async (parentType, childId) => {
      const { data: findParents, error: fetchError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", childId);
    
      if (fetchError) {
        console.error(`Error fetching parents for ancestor ${childId}:`, fetchError);
        return null;
      }
    
      // Return the correct parent id based on "father" or "mother"
      if (parentType === "f") {
        return findParents.length > 0 ? findParents[0].father_id : null;
      } else {
        return findParents.length > 0 ? findParents[0].mother_id : null;
      }
    };
    
    // recursive function to calculate ethnic breakdown
    const calculateEthnicBreakdown = async (childId, processedAncestors = new Set()) => {
      // Check if the current childId has already been processed to prevent infinite recursion
      if (processedAncestors.has(childId)) {
        console.log(`Ancestor ${childId} has already been processed.`);
        return [[], []]; // Return empty arrays to break the cycle
      }
    
      // Mark the current ancestor as processed
      processedAncestors.add(childId);
    
      let ethnicityNameArray = [];
      let ethnicityPercentageArray = [];
    
      // Get the father and mother ID asynchronously
      const fatherId = await getParents("f", childId);
      const motherId = await getParents("m", childId);
    
      if (fatherId === null && motherId === null) {
        // Base case: Deadend ancestor, return their ethnicity (assuming their percentage is 100)
        const { data: findParents } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", childId);
    
        ethnicityNameArray.push(findParents[0]?.ethnicity || 'Unknown');
        ethnicityPercentageArray.push(100);
      } else {
        // Recursive case: process father and/or mother ethnic breakdowns
        if (fatherId !== null) {
          const fatherEthnicity = await calculateEthnicBreakdown(fatherId, processedAncestors);
          fatherEthnicity[0].forEach((name, index) => {
            ethnicityNameArray.push(name);
            ethnicityPercentageArray.push(fatherEthnicity[1][index] / 2);
          });
        }
    
        if (motherId !== null) {
          const motherEthnicity = await calculateEthnicBreakdown(motherId, processedAncestors);
          motherEthnicity[0].forEach((name, index) => {
            if (ethnicityNameArray.includes(name)) {
              // If the ethnicity already exists, merge the percentages
              const idx = ethnicityNameArray.indexOf(name);
              ethnicityPercentageArray[idx] += motherEthnicity[1][index] / 2;
            } else {
              // Otherwise, add the ethnicity and its halved percentage
              ethnicityNameArray.push(name);
              ethnicityPercentageArray.push(motherEthnicity[1][index] / 2);
            }
          });
        }
      }
    
      return [ethnicityNameArray, ethnicityPercentageArray];
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
}
