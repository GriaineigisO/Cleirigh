import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS configuration (manually set in the handler)
const corsOptions = {
  origin: "https://cleirigh.vercel.app", 
  methods: ['GET', 'POST', 'OPTIONS'], 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS Pre-flight response (Handle OPTIONS)
export const options = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end(); // Successful preflight response
};

// Main login handler
export default async function handler(req, res) {
    console.log("test")
  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    return options(req, res);  // Early exit for OPTIONS (pre-flight) requests
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

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

    // Step 2: Compare password
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
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
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
}
