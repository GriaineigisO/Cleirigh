import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

// CORS configuration
const corsOptions = {
  origin: "https://cleirigh.vercel.app", 
  methods: ['GET', 'POST', 'OPTIONS'], 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] 
};

// Initialize express
const app = express();
app.use(cors(corsOptions));  // Apply CORS middleware
app.use(express.json());
app.use(bodyParser.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Main API route for login
app.post("/api/login", async (req, res) => {

  const { email, password } = req.body;

  try {
    // Step 1: Fetch user from Supabase
    const { data: users, error: fetchError } = await supabase
      .from('users')  // Replace 'users' with your Supabase table name
      .select('*')
      .eq('email', email)
      .limit(1);

    if (fetchError || !users.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // Step 2: Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 3: Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Token generated:", token);

    // Step 4: Send success response
    res.status(200).json({
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

// Vercel handler to use in serverless environment
export default async (req, res) => {
  await app(req, res);
};
