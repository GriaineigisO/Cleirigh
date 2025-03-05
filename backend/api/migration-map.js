import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", 
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
    res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));

    // Handle OPTIONS method for CORS preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const { data, error } = await supabase
            .from("ancestors")
            .select("ancestor_id, birth_place, father:father_id(birth_place), mother:mother_id(birth_place)");

        if (error) throw error;

        // Process parent-child birthplace relationships
        const validPairs = data.flatMap((child) => {
            const migrations = [];

            // Handle Father's birthplace
            const fatherBirth = child.father?.birth_place || child.birth_place; // If NULL, assume same as child
            if (fatherBirth && child.birth_place && fatherBirth !== child.birth_place) {
                migrations.push({
                    parent_birth: fatherBirth,
                    child_birth: child.birth_place
                });
            }

            // Handle Mother's birthplace
            const motherBirth = child.mother?.birth_place || child.birth_place; // If NULL, assume same as child
            if (motherBirth && child.birth_place && motherBirth !== child.birth_place) {
                migrations.push({
                    parent_birth: motherBirth,
                    child_birth: child.birth_place
                });
            }

            return migrations;
        });

        res.json(validPairs);
    } catch (error) {
        console.error("Error fetching parent-child birthplaces:", error);
        res.status(500).send("Server error");
    }
      
    } catch (error) {
      res.status(500).json({ error: "Error saving ancestor" });
    }
  };