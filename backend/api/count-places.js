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
      return res.status(400).json({ error: "Invalid tree identifier places" });
    }

    const treeTableName = `tree_${currentTree}`;

    // Fetch birth place data (filter non-null birth places)
    const { data: birthPlacesData, error: birthPlacesError } = await supabase
      .from(treeTableName)
      .select('place_of_birth')
      .not('place_of_birth', 'is', null); // Filters where place_of_birth is not null

    if (birthPlacesError) {
      throw new Error(birthPlacesError.message);
    }

    // Extract array of places and trim to just the first location
    let birthPlaces = birthPlacesData.map(row => row.place_of_birth.split(',')[0]);

    // Fetch death place data (filter non-null death places)
    const { data: deathPlacesData, error: deathPlacesError } = await supabase
      .from(treeTableName)
      .select('place_of_death')
      .not('place_of_death', 'is', null); // Filters where place_of_death is not null

    if (deathPlacesError) {
      throw new Error(deathPlacesError.message);
    }

    // Extract array of places and trim to just the first location
    let deathPlaces = deathPlacesData.map(row => row.place_of_death.split(',')[0]);

    // Combine birth and death places
    const allPlacesArray = [...birthPlaces, ...deathPlaces];

    // Filter out empty strings (null or undefined)
    const filteredArray = allPlacesArray.filter(place => place !== "");

    // Filter out duplicate places
    const uniquePlaces = [...new Set(filteredArray)];

    let arrayLength = uniquePlaces.length;

    // Truncate list to 20 places, and append "and more..." if necessary
    if (arrayLength > 20) {
      uniquePlaces.length = 20;
      uniquePlaces.push("and more...");
    }

    // Combine places into a comma-separated string
    const allPlacesJoined = uniquePlaces.join(", ");

    res.json({
      numOfPlaces: arrayLength,
      listOfPlaces: allPlacesJoined,
    });
  } catch (error) {
    console.log("Error counting places:", error);
    res.status(500).json({ error: "Failed to count places." });
  }
}
