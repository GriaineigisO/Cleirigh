// Import necessary modules
import { createClient } from '@supabase/supabase-js';

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your frontend domain
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

  // Handle OPTIONS method (for CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { currentTree } = req.body;

    if (!currentTree) {
      return res.status(400).json({ error: "Invalid tree identifier occupations" });
    }

    const treeTableName = `tree_${currentTree}`;

    // Fetch occupation data (filter non-null occupation values)
    const { data: occupationsData, error: occupationsError } = await supabase
      .from(treeTableName)
      .select('occupation')
      .not('occupation', 'is', null); // Filters where occupation is not null

    if (occupationsError) {
      throw new Error(occupationsError.message);
    }

    // Extract an array of occupations
    let occupationList = occupationsData.map(row => row.occupation);

    // Filter out duplicates
    const filteredNoDuplicatedArray = [...new Set(occupationList)];

    let occupationArrayLength = filteredNoDuplicatedArray.length;

    // Truncate list to 20 occupations, and append "and more..." if necessary
    if (occupationArrayLength > 20) {
      filteredNoDuplicatedArray.length = 20;
      filteredNoDuplicatedArray.push("and more...");
    }

    // Combine occupations into a comma-separated string
    const occupationJoined = filteredNoDuplicatedArray.join(", ");

    res.json({
      numOfOccupations: occupationArrayLength,
      listOfOccupations: occupationJoined,
    });
  } catch (error) {
    console.log("Error counting occupations:", error);
    res.status(500).json({ error: "Failed to count occupations." });
  }
}
