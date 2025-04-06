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
    const { userId, idNumber } = req.body;
    const id = idNumber;

    console.log("id is:", id);

    // Get the current tree ID from the user's record
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    //get all rows from the current tree in one single query
    const { data: getData } = await supabase
      .from(`tree_${currentTree}`)
      .select("*");

    //recursive function which determines the parent's ethnic breakdown. It first must gain the values of each deadend ancestor (hence continiously checking if a person has parents, going up one generation if he does)
    const calculateEthnicBreakdown = async (childId) => {
      let fatherEthnicityNameArray = [];
      let fatherEthnicityPercentageArray = [];
      let motherEthnicityNameArray = [];
      let motherEthnicityPercentageArray = [];
      let ethnicityNameArray = [];
      let ethnicityPercentageArray = [];

      const findParents = getData.find((person) => {
        return Number(person.ancestor_id) === childId;
      });

      console.log(findParents);
      const fatherId = findParents.father_id;
      const motherId = findParents.mother_id;

      //checks if each parent is a deadend ancestor
      if (fatherId === null && motherId === null) {
        //is a deadend ancestor, returns ethnicity and pushes 50 to the percentage array. If no ethnicity has been assigned to a dead end ancestor, then the label UNASSIGNED will be pushed - a prompt for the user to look for the dead-end ancestor and then assign an ethnicity
        if (findParents.ethnicity) {
          ethnicityNameArray.push(findParents.ethnicity);
        } else {
          ethnicityNameArray.push("UNASSIGNED");
        }

        ethnicityPercentageArray.push(100);

        return [ethnicityNameArray, ethnicityPercentageArray];
      } else if (fatherId !== null && motherId === null) {
        //ancestor has a father recorded, but not a mother. Mother is assumed to have the same ethnicity as the father - thus the father's values are passed down unchanged
        const fatherEthnicity = await calculateEthnicBreakdown(fatherId);
        for (let i = 0; i < fatherEthnicity[0].length; i++) {
          fatherEthnicityNameArray.push(fatherEthnicity[0][i]);
          fatherEthnicityPercentageArray.push(fatherEthnicity[1][i]);
        }

        return [fatherEthnicityNameArray, fatherEthnicityPercentageArray];
      } else if (fatherId === null && motherId !== null) {
        //ancestor has a mother recorded, but not a father. Father is assumed to have the same ethnicity as the mother - thus the mother's values are passed down unchanged
        const motherEthnicity = await calculateEthnicBreakdown(motherId);
        for (let i = 0; i < motherEthnicity[0].length; i++) {
          motherEthnicityNameArray.push(motherEthnicity[0][i]);
          motherEthnicityPercentageArray.push(motherEthnicity[1][i]);
        }

        return [motherEthnicityNameArray, motherEthnicityPercentageArray];
      } else if (fatherId !== null && motherId !== null) {
        //both parents are recorded. The values of each parent are halved and then added together to form the child's ethnic breakdown

        const fatherEthnicity = await calculateEthnicBreakdown(fatherId);
        for (let i = 0; i < fatherEthnicity[0].length; i++) {
          fatherEthnicityNameArray.push(fatherEthnicity[0][i]);
          fatherEthnicityPercentageArray.push(fatherEthnicity[1][i]);
        }

        const motherEthnicity = await calculateEthnicBreakdown(motherId);
        for (let i = 0; i < motherEthnicity[0].length; i++) {
          motherEthnicityNameArray.push(motherEthnicity[0][i]);
          motherEthnicityPercentageArray.push(motherEthnicity[1][i]);
        }

        let childEthnicityNameArray = [];
        let childEthnicityPercentageArray = [];

        //adds father's ethnic values - dividing the percentage of each one in half
        for (let i = 0; i < fatherEthnicityNameArray.length; i++) {
          childEthnicityNameArray.push(fatherEthnicity[0][i]);
          childEthnicityPercentageArray.push(fatherEthnicity[1][i] / 2);
        }

        //adds mother's ethnic values. First must check if any of the mother's ethnicities is shared with the father
        for (let i = 0; i < motherEthnicityNameArray.length; i++) {
          if (childEthnicityNameArray.includes(motherEthnicityNameArray[i])) {
            //ethnicity is already present in child. Don't add the name again. Simply take the percentage value, half it, and add it to the percentage value already present
            const index = childEthnicityNameArray.indexOf(
              motherEthnicityNameArray[i]
            );

            childEthnicityPercentageArray[index] =
              childEthnicityPercentageArray[index] +
              motherEthnicityPercentageArray[i] / 2;
          } else {
            childEthnicityNameArray.push(motherEthnicityNameArray[i]);
            childEthnicityPercentageArray.push(
              motherEthnicityPercentageArray[i] / 2
            );
          }
        }

        return [childEthnicityNameArray, childEthnicityPercentageArray];
      }
    };

    //initial call, with the target ancestor's ID in the argument
    const ethnicity = await calculateEthnicBreakdown(id);

    //sort percentages highest > lowest
    const zipped = ethnicity[0].map((name, i) => ({
      name,
      percentage: ethnicity[1][i],
    }));

    zipped.sort((a, b) => b.percentage - a.percentage);

    res.json({
      ethnicityNameArray: zipped.map((e) => e.name),
      ethnicityPercentageArray: zipped.map((e) => e.percentage),
    });
  } catch (error) {
    console.log("error calculating ethnic breakdown:", error);
  }
}
