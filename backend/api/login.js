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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


app.post("/api/login", async (req, res) => {

  
  const { email, password } = req.body;

  try {
    // Step 1: Fetch user from Supabase
    const { data: users, error: fetchError } = await supabase
      .from('users') // Replace 'users' with the actual table name in your Supabase
      .select('*')
      .eq('email', email)
      .limit(1); // Limit the result to one user

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return res.status(500).json({ message: "Server error during fetch." });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // Step 2: Compare password with hashed password from Supabase
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 3: Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Token generated:", token);

    // Step 4: Send response
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});