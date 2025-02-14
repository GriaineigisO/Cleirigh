import { createClient } from "@supabase/supabase-js";

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(", ")
  );

  // Handle OPTIONS method (for CORS preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  try {
    const { userId, id, sex } = req.body;

    // Query to get the current tree
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const currentTree = user.current_tree_id;

    // Function to handle retrieving a name
    const getName = (person) => {
      const firstName = person.first_name || "UNKNOWN";
      const middleName = person.middle_name || "";
      const lastName = person.last_name || "";
      return `${firstName} ${middleName} ${lastName}`;
    };

    // Function to fetch child details and return name and ID
    const getChildDetails = async (id, sex) => {
      const { data: children, error: childError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq(sex === "male" ? "father_id" : "mother_id", id);

      if (childError) {
        throw new Error(childError.message);
      }

      return children.map((child) => ({
        name: getName(child),
        id: child.ancestor_id,
      }));
    };

    // Function to get spouse info from the first child's mother/father id
    const getSpouseDetails = async (childId, sex) => {
      const field = sex === "male" ? "mother_id" : "father_id";

      const { data: spouseData, error: spouseError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", childId);

      let spouseId = "";
      if (sex === "male") {
        spouseId = spouseData[0].mother_id;
      } else {
        spouseId = spouseData[0].father_id;
      }

      if (!spouseId) return null;

      const { data: spouse, error: spouseDetailsError } = await supabase
        .from(`tree_${currentTree}`)
        .select("*")
        .eq("ancestor_id", spouseId)
        .single();

      if (spouseDetailsError) {
        throw new Error(spouseDetailsError.message);
      }

      return [getName(spouse), spouseId];
    };

    // Get child details
    const childDetails = await getChildDetails(id, sex);

    if (childDetails.length > 0) {
      // Get the spouse for the first child (if exists)
      const spouseDetailsArray = await getSpouseDetails(
        childDetails[0].id,
        sex
      );
      let spouseName = "";
      let spouseId = "";
      if (spouseDetailsArray) {
        spouseName = spouseDetailsArray[0];
        spouseId = spouseDetailsArray[1];
      }

      res.json({
        childName: childDetails.map((child) => child.name),
        spouseName: spouseName || "",
        childId: childDetails.map((child) => child.id),
        spouseId: spouseId,
      });
    } else {
      res.json({
        childName: [],
        spouseName: "",
        childId: [],
        spouseId: "",
      });
    }
  } catch (error) {
    console.log("Error getting child's profile: ", error);
    res.status(500).json({ error: "Error getting child's details" });
  }
}
