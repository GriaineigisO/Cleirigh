import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
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

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, idNumber } = req.body;
    const id = idNumber;
    const ethnicityNameArray = [];
    const ethnicityPercentageArray = [];

    console.log(`Querying ancestor ${currentAncestorId} in table tree_${currentTree}`);
    // Query to get the current tree id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const currentTree = user.current_tree_id;
    console.log("current tree", currentTree);

    // Function to process the ethnicities iteratively
    async function getAncestorData(ancestorId) {
      console.log("getting data");

      const stack = [ancestorId];
      const processedAncestors = new Set();

      while (stack.length > 0) {
        const currentAncestorId = stack.pop();

        console.log(currentAncestorId);

        // Fetch current ancestor data
        const { data: ancestorData, error } = await supabase
          .from(`tree_${currentTree}`)
          .select("*")
          .eq("ancestor_id", currentAncestorId)
          .single();

        console.log("Data:", data); // Check what data is returned
        console.log("Error:", error); // Check if there's any error

        console.log(ancestorData);

        if (error) {
          console.error("Error fetching ancestor:", error);
          continue;
        }

        if (!ancestorData) {
          console.log(`Ancestor data not found for ID: ${currentAncestorId}`);
          continue;
        }

        // Process dead-end ancestors (no changes to their ethnicity)
        if (!ancestorData.father_id && !ancestorData.mother_id) {
          const ethnicity = ancestorData.ethnicity; // Leave ethnicity intact for dead-end ancestors
          const percentage = 100;

          // Add to ethnicityNameArray and ethnicityPercentageArray
          if (!ethnicityNameArray.includes(ethnicity)) {
            ethnicityNameArray.push(ethnicity);
            ethnicityPercentageArray.push(percentage);
            console.log("dead end ethnicity", ethnicityNameArray);
            console.log("dead end ethnicity percent", ethnicityPercentageArray);
          } else {
            const index = ethnicityNameArray.indexOf(ethnicity);
            ethnicityPercentageArray[index] += percentage;
            console.log("else percentage array", ethnicityPercentageArray);
          }
        } else {
          // If parents exist, add them to the stack for processing
          if (
            ancestorData.father_id &&
            !processedAncestors.has(ancestorData.father_id)
          ) {
            stack.push(ancestorData.father_id);
            processedAncestors.add(ancestorData.father_id);
          }

          if (
            ancestorData.mother_id &&
            !processedAncestors.has(ancestorData.mother_id)
          ) {
            stack.push(ancestorData.mother_id);
            processedAncestors.add(ancestorData.mother_id);
          }

          // Combine ethnicity from the father and mother
          const fatherEthnicity = ancestorData.father_id
            ? await getAncestorEthnicity(ancestorData.father_id)
            : [];
          const motherEthnicity = ancestorData.mother_id
            ? await getAncestorEthnicity(ancestorData.mother_id)
            : [];

          console.log("fatherEthnicity", fatherEthnicity);
          console.log("motherEthnicity", motherEthnicity);
          // Merge ethnicities and percentages
          mergeEthnicityData(
            fatherEthnicity,
            motherEthnicity,
            ethnicityNameArray,
            ethnicityPercentageArray
          );
        }
      }

      return { ethnicityNameArray, ethnicityPercentageArray };
    }

    getAncestorData(id);

    // Function to retrieve ethnicity for an ancestor
    async function getAncestorEthnicity(ancestorId) {
      const { data: ancestorData, error } = await supabase
        .from(`tree_${currentTree}`)
        .select("ethnicity")
        .eq("ancestor_id", ancestorId)
        .single();

      if (error || !ancestorData) {
        console.error("Error fetching ancestor ethnicity:", error);
        return [];
      }

      return ancestorData.ethnicity.split("-"); // Split combined ethnicities if needed
    }

    // Function to merge two ethnicity data arrays (father and mother)
    function mergeEthnicityData(
      fatherEthnicity,
      motherEthnicity,
      ethnicityNameArray,
      ethnicityPercentageArray
    ) {
      console.log("merging values");
      const combinedEthnicities = [...fatherEthnicity, ...motherEthnicity];
      const totalEthnicities = combinedEthnicities.length;
      const percentage = 100 / totalEthnicities;

      combinedEthnicities.forEach((ethnicity) => {
        if (!ethnicityNameArray.includes(ethnicity)) {
          ethnicityNameArray.push(ethnicity);
          ethnicityPercentageArray.push(percentage);
          console.log("merged ethnicity array", ethnicityNameArray);
          console.log("merged ethnic percent array", ethnicityPercentageArray);
        } else {
          const index = ethnicityNameArray.indexOf(ethnicity);
          ethnicityPercentageArray[index] += percentage;
        }
      });
    }

    // Send the final ethnicity data as arrays
    res.json({
      ethnicityNameArray: ethnicityNameArray,
      ethnicityPercentageArray: ethnicityPercentageArray,
    });
  } catch (error) {
    console.log("Error calculating ethnic breakdown:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
