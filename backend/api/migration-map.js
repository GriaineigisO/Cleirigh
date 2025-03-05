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
        // Fetch all ancestors
        const { data, error } = await supabase
            .from("ancestors")
            .select("ancestor_id, birth_place, father_id, mother_id");

        if (error) throw error;

        // Convert to a dictionary for easy lookup
        const ancestors = {};
        data.forEach((person) => {
            ancestors[person.ancestor_id] = {
                id: person.ancestor_id,
                birth_place: person.birth_place,
                father_id: person.father_id,
                mother_id: person.mother_id
            };
        });

        // Function to find the closest known birthplace in the lineage
        const getBirthPlace = (id) => {
            let current = ancestors[id];
            while (current && !current.birth_place) {
                // Try to inherit birthplace from father first, then mother
                current = ancestors[current.father_id] || ancestors[current.mother_id];
            }
            return current?.birth_place || null; // Return closest found birthplace
        };

        // Process each child and assign missing birthplaces
        Object.values(ancestors).forEach((child) => {
            if (!child.birth_place) {
                child.birth_place = getBirthPlace(child.id);
            }
        });

        // Create migration arrows for parents
        const validPairs = Object.values(ancestors).flatMap((child) => {
            const migrations = [];

            if (child.father_id && ancestors[child.father_id]?.birth_place !== child.birth_place) {
                migrations.push({
                    parent_birth: ancestors[child.father_id]?.birth_place,
                    child_birth: child.birth_place
                });
            }

            if (child.mother_id && ancestors[child.mother_id]?.birth_place !== child.birth_place) {
                migrations.push({
                    parent_birth: ancestors[child.mother_id]?.birth_place,
                    child_birth: child.birth_place
                });
            }

            return migrations;
        });

        res.json(validPairs);
    } catch (error) {
        console.error("Error processing parent-child migrations:", error);
        res.status(500).send("Server error");
    }
      
    } catch (error) {
      res.status(500).json({ error: "Error saving ancestor" });
    }
  };