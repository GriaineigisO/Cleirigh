import { createClient } from "@supabase/supabase-js";

// CORS Options
const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your frontend domain
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
    const { userId, rightNote, rightNoteHeadline, pageNum } = req.body;

    const pageNumber = Number(pageNum);

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    const { data: checkIfPageHasNotes, checkIfPageHasNotesError } =
      await supabase
        .from("notes")
        .select("*")
        .eq("tree_id", currentTree)
        .eq("page_number", pageNumber);

    if (checkIfPageHasNotes.length === 0) {
      const { data, error } = await supabase
        .from("notes") // Specify the table name
        .insert([
          {
            tree_id: currentTree,
            page_number: pageNumber,
            right_note: rightNote,
            right_note_headline: rightNoteHeadline,
          },
        ]);

      if (error) {
        console.error("Error saving right note:", error.message);
      } else {
        console.log("Right note saved successfully:", data);
      }

      res.json(true);
    } else {
      const {data: saveRightNote, saveRightNoteError} = await supabase 
        .from("notes")
        .update({right_note: rightNote, right_note_headline: rightNoteHeadline})
        .eq("tree_id", currentTree)
        .eq("page_number", currentPage)

      res.json(true);
    }
  } catch (error) {
    console.log("Error saving right note:", error);
  }
}
