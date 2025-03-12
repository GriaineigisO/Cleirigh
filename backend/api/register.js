import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corsOptions = {
  origin: "https://cleirighgenealogy.com", // Replace with your domain
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default async function handler(req, res) {
      // Enable CORS for all requests (including OPTIONS)
  res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists using Supabase
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (error) {
      return res.status(500).json({ message: "Server error during user check" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert new user into the users table in Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password: hashedPassword,
          id: Date.now()
        }
      ])
      .single();

    if (insertError) {
      return res.status(500).json({ message: "Error inserting new user" });
    }

    // 4. Generate the JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(username)

    // 5. Respond with token and user data
    res.json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).send("Server error");
  }
};