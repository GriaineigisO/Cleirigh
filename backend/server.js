const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cleirighUserDB = require("./db");
const e = require("express");
const multer = require("multer");
const path = require("path");
const { createClient } = require('@supabase/supabase-js');

const corsOptions = {
  origin: "https://cleirigh.vercel.app", 
  methods: ['GET', 'POST', 'OPTIONS'], 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] 
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Set up environment variables for Supabase credentials in .env
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create the client
const supabase = createClient(supabaseUrl, supabaseKey);


// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(
  session({
    secret: "enter secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Serve static files from the React frontend app.
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Route to serve index.html from the build directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});




//checks if user has a paid account or not
// app.get('/api/user', async (req, res) => {
//     const username = req.query.username;
//     try {
//         const result = await cleirighUserDB.query('SELECT premium FROM users WHERE username = $1', [username]);

//         if (result.rows.length > 0) {
//             const premium = result.rows[0].premium;
//             res.json({ premium });
//         } else {
//             res.status(404).json({ message: 'user not found'});
//         }
//     } catch (error) {
//         console.error('Error querying database:', error);
//         res.status(500).json({ message: 'Internal server error'});
//     }
// });



// Route to handle file uploads
app.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    res.status(200).send({
      fileName: req.file.filename,
      message: "File uploaded successfully",
    });
  } catch (err) {
    res.status(500).send({ error: "Error uploading file" });
  }
});

app.post("/save-image-link", async (req, res) => {
  try {
    const { userId, profileData, fileName } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0]?.current_tree_id;

    if (!currentTree) {
      return res
        .status(404)
        .send({ error: "Current tree not found for this user" });
    }

    // Construct image link
    const imageLink = `http://localhost:5000/uploads/${fileName}`;

    // Save image link in the database
    const saveImageLink = await pool.query(
      `INSERT INTO images (tree_id, ancestor_id, image_link) VALUES ($1, $2, $3)`,
      [currentTree, profileData.ancestor_id, imageLink]
    );

    res.status(200).send({ message: "Image link saved successfully" });
  } catch (err) {
    console.error("Error saving image link:", err);
    res.status(500).send({ error: "Error saving image link" });
  }
});

app.post("/set-profile-picture", async (req, res) => {
  try {
    const { userId, profileData, fileName } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0]?.current_tree_id;

    if (!currentTree) {
      return res
        .status(404)
        .send({ error: "Current tree not found for this user" });
    }

    // Construct the image link
    const imageLink = `http://localhost:5000/uploads/${fileName}`;

    // Save the image link by updating the appropriate table
    const saveImageLink = await pool.query(
      `UPDATE tree_${currentTree}
             SET profile_pic = $1
             WHERE ancestor_id = $2`,
      [imageLink, profileData.ancestor_id]
    );

    res.status(200).send({ message: "Profile picture set successfully" });
  } catch (err) {
    console.error("Error saving image link:", err);
    res.status(500).send({ error: "Error saving profile picture" });
  }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
