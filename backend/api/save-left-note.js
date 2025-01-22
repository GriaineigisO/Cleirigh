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
    const { userId, leftNote, leftNoteHeadline } = req.body;

    // Get current tree id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_tree_id")
      .eq("id", userId)
      .single();

    const currentTree = user.current_tree_id;

    // Query to get the current page
    const { data: getCurrentPage, getCurrentPageError } = await supabase
      .from("users")
      .select("current_page")
      .eq("id", userId);

    const currentPage = getCurrentPage[0].current_page;

    const { data: checkIfPageHasNotes, checkIfPageHasNotesError } =
      await supabase
        .from("notes")
        .select("*")
        .eq("tree_id", currentTree)
        .update("page_number", currentPage);

    if (checkIfPageHasNotes.length === 0) {
      const { data, error } = await supabase
        .from("notes") // Specify the table name
        .insert([
          {
            tree_id: currentTree,
            page_number: currentPage,
            left_note: leftNote,
            left_note_headline: leftNoteHeadline,
          },
        ]);

      if (error) {
        console.error("Error saving left note:", error.message);
      } else {
        console.log("Left note saved successfully:", data);
      }

      res.json(true);
    } else {
      const {data: saveLeftNote, saveLeftNoteError} = await supabase 
        .from("notes")
        .update({left_note: leftNote, left_note_headline: leftNoteHeadline})
        .eq("tree_id", currentTree)
        .eq("page_number", currentPage)

      res.json(true);
    }
  } catch (error) {
    console.log("Error saving left note:", error);
  }
}
