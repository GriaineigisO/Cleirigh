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
  origin: "http://localhost:3000", // Allow only this origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
  credentials: true
};


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

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

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

app.post("/api/register", async (req, res) => {
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
          id: Date.now(), // or generate a proper ID using UUID if needed
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

// makes a new tree
app.post("/make-new-tree", async (req, res) => {
  try {
    const { userId, treeName, treeId } = req.body;

    // 1. Insert the new tree record into the `trees` table
    const { data: newTree, error: treeError } = await supabase
      .from('trees')
      .insert([
        { user_id: userId, tree_name: treeName, tree_id: treeId }
      ])
      .single(); // Return the inserted row directly

    if (treeError) {
      console.error('Error inserting new tree:', treeError);
      return res.status(500).json({ error: 'Database query failed for tree creation' });
    }

    // 2. Create a dynamic table for storing ancestors in the new tree
    // NOTE: Supabase doesn't directly support `CREATE TABLE` via the client, so we have to use Supabase RPC functions if needed.
    // You can write an SQL function in Supabase to execute the dynamic table creation.

    // Sample dynamic SQL execution (this requires you to define a function in Supabase database first)
    const { data: createTableData, error: createTableError } = await supabase
      .rpc('create_tree_table', {
        tree_id: treeId // Pass tree_id to your SQL function to handle dynamic table creation
      });

    if (createTableError) {
      console.error('Error creating dynamic tree table:', createTableError);
      return res.status(500).json({ error: 'Error creating dynamic tree table' });
    }

    // 3. Send back the response with the tree details
    res.status(201).json({
      success: true,
      message: "Tree created successfully",
      tree: { treeId: newTree.tree_id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//determines if the user has not made a tree yet
app.post("/check-if-no-trees", async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch data using Supabase client
    const { data, error } = await supabase
      .from('trees')
      .select('user_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching trees:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Check if the user has trees
    if (data.length > 0) {
      res.json({ hasTrees: true });
    } else {
      // User has no trees, return false
      res.json({ hasTrees: false });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//gets the name of a user's tree
app.post("/get-tree-name", async (req, res) => {
  const { userId } = req.body;

  try {
    // Step 1: Get the current tree ID for the user
    const { data: userData, error: userError } = await supabase
      .from('users') // Replace 'users' with your actual table name
      .select('current_tree_id') // Only select the `current_tree_id`
      .eq('id', userId) // Filter for the user ID
      .single(); // Expect one result

    if (userError || !userData) {
      console.error("Error fetching current_tree_id:", userError || "No user found");
      return res.status(404).json({ error: "User or current tree not found" });
    }

    const currentTreeId = userData.current_tree_id;

    // Step 2: Get the tree name for the current tree ID
    const { data: treeData, error: treeError } = await supabase
      .from('trees') // Replace 'trees' with your actual table name
      .select('tree_name') // Only select `tree_name`
      .eq('tree_id', currentTreeId) // Filter for the current tree ID
      .single(); // Expect one result

    if (treeError || !treeData) {
      console.error("Error fetching tree name:", treeError || "No tree found");
      return res.status(404).json({ error: "Tree not found" });
    }

    const treeName = treeData.tree_name;

    res.json({ treeName: treeName });

  } catch (err) {
    console.error("Error during request processing:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Updates the current tree for the user
app.post("/set-current-tree", async (req, res) => {
  try {
    const { userId, treeId } = req.body;

    if (!userId || !treeId) {
      return res.status(400).json({ error: "Missing userId or treeId" });
    }

    // Update the current_tree column for the user
    const { data, error } = await supabase
      .from('users')
      .update({ current_tree_id: treeId })
      .eq('id', userId)
      .select('current_tree_id');

    if (error) {
      console.error("Error updating current tree:", error.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found or update failed" });
    }

    // Return the updated current tree ID
    res.status(200).json({
      success: true,
      message: "Current tree updated successfully",
      currentTree: data[0].current_tree_id,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch the current tree for the user
app.post("/get-current-tree", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Query to get the current tree using Supabase client
    const { data, error } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single(); // Use .single() to get a single row rather than an array

    if (error) {
      console.error("Error fetching current tree:", error.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      currentTree: data.current_tree_id,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//check if the currently selected tree is empty
app.post("/check-if-tree-empty", async (req, res) => {
  try {
    const { currentTree } = req.body;

    if (!currentTree) {
      return res.status(400).json({ error: "No valid tree provided" });
    }

    const treeTableName = `tree_${currentTree}`; // Dynamic table name

    // Get all rows from the dynamically named table
    const { data, error } = await supabase
      .from(treeTableName)
      .select('*'); // Selecting all rows to check if the table is empty

    if (error) {
      console.error("Error checking if tree is empty:", error.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    // If data is not empty, return isEmpty: false
    if (data.length > 0) {
      res.json({ isEmpty: false });
    } else {
      // If data is empty, return isEmpty: true
      res.json({ isEmpty: true });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//adds the very first person to the tree as a base user
app.post("/add-first-person", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      sex,
      ethnicity,
      birthDate,
      birthPlace,
      deathDate,
      deathPlace,
      deathCause,
      occupation,
      currentTree,
    } = req.body;

    // Make random six-digit number for ancestor_id
    const ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const page_number = 1;
    const base_person = true;

    // We want to insert the data into the corresponding "tree_{currentTree}" table
    const treeTableName = `tree_${currentTree}`;

    // Use Supabase for inserting data into the dynamic tree table
    const { data, error } = await supabase
      .from(treeTableName)
      .insert([
        {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          ancestor_id: ancestor_id,
          page_number: page_number,
          base_person: base_person,
          base_of_page: 1, // Assuming this is the default value (base_of_page).
          sex: sex,
          ethnicity: ethnicity,
          date_of_birth: birthDate,
          place_of_birth: birthPlace,
          date_of_death: deathDate,
          place_of_death: deathPlace,
          cause_of_death: deathCause,
          occupation: occupation,
          relation_to_user: [0], // Assuming this is the default value (relates to user).
        }
      ]);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ message: "First person added successfully!" });
  } catch (error) {
    console.log("Error adding first person:", error);
    res.status(500).json({ error: "Error adding first person." });
  }
});

//counts the amount of ancestors in the tree, not including the base person
app.post("/count-ancestors", async (req, res) => {
  try {
    const { currentTree } = req.body;

    const treeTableName = `tree_${currentTree}`;

    // Fetch all rows from the tree_{currentTree} table
    const { data, error } = await supabase
      .from(treeTableName)
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    // Exclude the first row (if needed, depending on your application logic)
    const ancestorCount = data.length - 1;

    res.json({ ancestorCount });
  } catch (error) {
    console.log("Error counting ancestors:", error);
    res.status(500).json({ error: "Failed to count ancestors." });
  }
});

//counts the amount of places mentioned in the tree
app.post("/count-places", async (req, res) => {
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
});

//counts the amount of places mentioned in the tree
app.post("/count-occupations", async (req, res) => {
  try {
    const { currentTree } = req.body;
    if (!currentTree) {
      return res
        .status(400)
        .json({ error: "Invalid tree identifier occupations" });
    }

    const treeTableName = `tree_${currentTree}`;

    // Fetch occupation data (filter non-null occupation values)
    const { data: occupationsData, error: occupationsError } = await supabase
      .from(treeTableName)
      .select('occupation')
      .not('occupation', 'is', null); // Filters where occupation is not null

    if (occupationsError) {
      throw new Error(occupationsError.message);
    }

    // Extract an array of occupations
    let occupationList = occupationsData.map(row => row.occupation);

    // Filter out duplicates
    const filteredNoDuplicatedArray = [...new Set(occupationList)];

    let occupationArrayLength = filteredNoDuplicatedArray.length;

    // Truncate list to 20 occupations, and append "and more..." if necessary
    if (occupationArrayLength > 20) {
      filteredNoDuplicatedArray.length = 20;
      filteredNoDuplicatedArray.push("and more...");
    }

    // Combine occupations into a comma-separated string
    const occupationJoined = filteredNoDuplicatedArray.join(", ");

    res.json({
      numOfOccupations: occupationArrayLength,
      listOfOccupations: occupationJoined,
    });
  } catch (error) {
    console.log("Error counting occupations:", error);
    res.status(500).json({ error: "Failed to count occupations." });
  }
});

//gets a list of all ancestors and basic info of them
app.post("/get-all-ancestors", async (req, res) => {
  try {
    const { userId } = req.body;

    // Query to get the current tree ID for the user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const currentTree = userData?.current_tree_id;

    // Check if currentTree exists before proceeding
    if (!currentTree) {
      return res.status(404).json({ error: "Current tree not found" });
    }

    const treeTableName = `tree_${currentTree}`;

    // Fetch the ancestors data from the dynamically named table
    const { data: ancestorsData, error: ancestorsError } = await supabase
      .from(treeTableName)
      .select(
        'first_name, middle_name, last_name, sex, date_of_birth, place_of_birth, date_of_death, place_of_death, ethnicity, base_person'
      );

    if (ancestorsError) {
      throw new Error(ancestorsError.message);
    }

    // Extract arrays from the response
    const firstNames = ancestorsData.map((row) => row.first_name);
    const middleNames = ancestorsData.map((row) => row.middle_name);
    const lastNames = ancestorsData.map((row) => row.last_name);
    const sexes = ancestorsData.map((row) => row.sex);
    const datesOfBirth = ancestorsData.map((row) => row.date_of_birth);
    const placesOfBirth = ancestorsData.map((row) => row.place_of_birth);
    const datesOfDeath = ancestorsData.map((row) => row.date_of_death);
    const placesOfDeath = ancestorsData.map((row) => row.place_of_death);
    const ethnicities = ancestorsData.map((row) => row.ethnicity);
    const basePerson = ancestorsData.map((row) => row.base_person);

    // Return all extracted data in response
    res.json({
      firstNames: firstNames,
      middleNames: middleNames,
      lastNames: lastNames,
      sexes: sexes,
      datesOfBirth: datesOfBirth,
      placesOfBirth: placesOfBirth,
      datesOfDeath: datesOfDeath,
      placesOfDeath: placesOfDeath,
      ethnicities: ethnicities,
      basePerson: basePerson,
    });
  } catch (error) {
    console.log("Error fetching all ancestors:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
});

//gets a list of all trees that a user has
app.post("/get-all-trees", async (req, res) => {
  const { userId } = req.body;

  try {
    // Query to fetch all trees for the given user ID
    const { data: allTrees, error } = await supabase
      .from('trees') // Replace 'trees' with the name of your Supabase table
      .select('tree_name, tree_id') // Select only necessary fields
      .eq('user_id', userId); // Filter by user_id

    // Handle query errors
    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ message: "Error fetching tree data." });
    }

    // Extract tree names and IDs
    const treeName = allTrees.map(tree => tree.tree_name);
    const treeID = allTrees.map(tree => tree.tree_id);

    res.json({
      treeName: treeName,
      treeID: treeID,
    });

  } catch (error) {
    console.error("Error getting list of all trees:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/switch-trees", async (req, res) => {
  try {
    const { userId, treeId } = req.body;

    // Switch the user's current tree
    const { data, error } = await supabase
      .from('users')
      .update({ current_tree_id: treeId })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    res.json(true);
  } catch (error) {
    console.log("Error switching trees: ", error);
    res.status(500).json({ error: "Error switching trees" });
  }
});

//gets the first name of the base person
app.post("/get-base-person", async (req, res) => {
  try {
    const { userId } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const baseUserquery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE base_person = true
            `);

    const fullName = `${baseUserquery.rows[0].first_name} ${baseUserquery.rows[0].middle_name} ${baseUserquery.rows[0].last_name}`;

    res.json({
      firstName: baseUserquery.rows[0].first_name,
      middleName: baseUserquery.rows[0].middle_name,
      lastName: baseUserquery.rows[0].last_name,
      id: baseUserquery.rows[0].ancestor_id,
      fullName: fullName,
      birthDate: baseUserquery.rows[0].date_of_birth,
      birthPlace: baseUserquery.rows[0].place_of_birth,
      deathDate: baseUserquery.rows[0].date_of_death,
      deathPlace: baseUserquery.rows[0].place_of_death,
      occupation: baseUserquery.rows[0].occupation,
      ethnicity: baseUserquery.rows[0].ethnicity,
      profileNumber: baseUserquery.rows[0].ancestor_id,
      sex: baseUserquery.rows[0].sex_id,
      memberOfNobility: baseUserquery.rows[0].member_of_nobility,
    });
  } catch (error) {
    console.log("Error getting base user's name:", error);
  }
});

//gets the father of the person at the bottom of a tree chart
app.post("/get-father", async (req, res) => {
  try {
    const { userId, personID } = req.body;

    // Query to get the current tree
    const { data: currentTreeData, error: currentTreeError } = await supabase
      .from('users')
      .select('current_tree_id')
      .eq('id', userId)
      .single(); // Get a single row

    if (currentTreeError) {
      throw new Error(currentTreeError.message);
    }

    const currentTree = currentTreeData.current_tree_id;

    // Query to find the person's parents
    const { data: parentQuery, error: parentError } = await supabase
      .from(`tree_${currentTree}`)
      .select('*')
      .eq('ancestor_id', personID)
      .single(); // Get a single row

    if (parentError) {
      throw new Error(parentError.message);
    }

    const fatherID = parentQuery.father_id;

    // Query for the father’s information using father ID
    const { data: fatherQuery, error: fatherError } = await supabase
      .from(`tree_${currentTree}`)
      .select('*')
      .eq('ancestor_id', fatherID)
      .single(); // Get a single row

    if (fatherError) {
      throw new Error(fatherError.message);
    }

    if (fatherID && fatherQuery) {
      // Set default values if data is missing
      const fatherFirstName = fatherQuery.first_name ?? "UNKNOWN";
      const fatherMiddleName = fatherQuery.middle_name ?? "";
      const fatherLastName = fatherQuery.last_name ?? "";

      const fatherFullName = `${fatherFirstName} ${fatherMiddleName} ${fatherLastName}`;

      res.json({
        fatherID: fatherID,
        fatherFullName: fatherFullName,
        fatherFirstName: fatherFirstName,
        fatherMiddleName: fatherMiddleName,
        fatherLastName: fatherLastName,
        fatherBirthDate: fatherQuery.date_of_birth,
        fatherBirthPlace: fatherQuery.place_of_birth,
        fatherDeathDate: fatherQuery.date_of_death,
        fatherDeathPlace: fatherQuery.place_of_death,
        fatherOccupation: fatherQuery.occupation,
        fatherProfileNumber: fatherQuery.ancestor_id,
        fatherEthnicity: fatherQuery.ethnicity,
        fatherCauseOfDeath: fatherQuery.cause_of_death,
        relation_to_user: fatherQuery.relation_to_user,
        uncertainFirstName: fatherQuery.uncertain_first_name,
        uncertainMiddleName: fatherQuery.uncertain_middle_name,
        uncertainLastName: fatherQuery.uncertain_last_name,
        uncertainBirthDate: fatherQuery.uncertain_birth_date,
        uncertainBirthPlace: fatherQuery.uncertain_birth_place,
        uncertainDeathDate: fatherQuery.uncertain_death_date,
        uncertainDeathPlace: fatherQuery.uncertain_death_place,
        uncertainOccupation: fatherQuery.uncertain_occupation,
        pageNum: fatherQuery.base_of_page,
        memberOfNobility: fatherQuery.member_of_nobility,
      });
    } else {
      // In case no father is found, return null values
      res.json({
        fatherID: null,
        fatherFullName: null,
        fatherFirstName: null,
        fatherMiddleName: null,
        fatherLastName: null,
        fatherBirthDate: null,
        fatherBirthPlace: null,
        fatherDeathDate: null,
        fatherDeathPlace: null,
        fatherOccupation: null,
        fatherProfileNumber: null,
        fatherEthnicity: null,
        fatherCauseOfDeath: null,
        relation_to_user: null,
        uncertainFirstName: null,
        uncertainMiddleName: null,
        uncertainLastName: null,
        uncertainBirthDate: null,
        uncertainBirthPlace: null,
        uncertainDeathDate: null,
        uncertainDeathPlace: null,
        uncertainOccupation: null,
        pageNum: null,
        memberOfNobility: null,
      });
    }
  } catch (error) {
    console.log("Error getting father:", error);
    res.status(500).json({ error: "Error fetching father's data" });
  }
});


//gets the mother of the person at the bottom of a tree chart
app.post("/get-mother", async (req, res) => {
  try {
    const { userId, personID } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //finds the IDs of the person's parents
    const parentQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${personID}
            `);

    const motherID = parentQuery.rows[0].mother_id;
    

    const motherQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${motherID}
        `);

    let motherFirstName = "";
    let motherMiddleName = "";
    let motherLastName = "";

    if (motherID && motherQuery.rows[0]) {
      if (motherQuery.rows[0].first_name === null) {
        motherFirstName = "UNKNOWN";
      } else {
        motherFirstName = motherQuery.rows[0].first_name;
      }

      if (motherQuery.rows[0].middle_name === null) {
        motherMiddleName = "";
      } else {
        motherMiddleName = motherQuery.rows[0].middle_name;
      }

      if (motherQuery.rows[0].last_name === null) {
        motherLastName = "";
      } else {
        motherLastName = motherQuery.rows[0].last_name;
      }

      const motherFullName = `${motherFirstName} ${motherMiddleName} ${motherLastName}`;

      res.json({
        motherID: motherID,
        motherFullName: motherFullName,
        motherFirstName: motherFirstName,
        motherMiddleName: motherMiddleName,
        motherLastName: motherLastName,
        motherBirthDate: motherQuery.rows[0].date_of_birth,
        motherBirthPlace: motherQuery.rows[0].place_of_birth,
        motherDeathDate: motherQuery.rows[0].date_of_death,
        motherDeathPlace: motherQuery.rows[0].place_of_death,
        motherOccupation: motherQuery.rows[0].occupation,
        motherProfileNumber: motherQuery.rows[0].ancestor_id,
        motherEthnicity: motherQuery.rows[0].ethnicity,
        motherCauseOfDeath: motherQuery.rows[0].cause_of_death,
        relation_to_user: motherQuery.rows[0].relation_to_user,
        uncertainFirstName: motherQuery.rows[0].uncertain_first_name,
        uncertainMiddleName: motherQuery.rows[0].uncertain_middle_name,
        uncertainLastName: motherQuery.rows[0].uncertain_last_name,
        uncertainBirthDate: motherQuery.rows[0].uncertain_birth_date,
        uncertainBirthPlace: motherQuery.rows[0].uncertain_birth_place,
        uncertainDeathDate: motherQuery.rows[0].uncertain_death_date,
        uncertainDeathPlace: motherQuery.rows[0].uncertain_death_place,
        uncertainOccupation: motherQuery.rows[0].uncertain_occupation,
        pageNum: motherQuery.rows[0].base_of_page,
        memberOfNobility: motherQuery.rows[0].member_of_nobility,
      });
    } else {
      res.json({
        motherID: null,
        motherFullName: null,
        motherFirstName: null,
        motherMiddleName: null,
        motherLastName: null,
        motherBirthDate: null,
        motherBirthPlace: null,
        motherDeathDate: null,
        motherDeathPlace: null,
        motherOccupation: null,
        motherProfileNumber: null,
        motherEthnicity: null,
        motherCauseOfDeath: null,
        relation_to_user: null,
        uncertainFirstName: null,
        uncertainMiddleName: null,
        uncertainLastName: null,
        uncertainBirthDate: null,
        uncertainBirthPlace: null,
        uncertainDeathDate: null,
        uncertainDeathPlace: null,
        uncertainOccupation: null,
        pageNum: null,
        memberOfNobility: null,
      })
    }
  } catch (error) {
    console.log("Error getting mother:", error);
  }
});

app.post("/set-current-page-number", async (req, res) => {
  try {
    const { userId, num } = req.body;

    const setNum = await pool.query(`
            UPDATE users    
            SET current_page = ${num}
            WHERE id = ${userId}
        `);

    res.json(true);
  } catch (error) {
    console.log("Error setting page number:", error);
  }
});

app.post("/get-current-page-number", async (req, res) => {
  try {
    const { userId } = req.body;

    //finds the latest current page number saved to the user db
    const pageNum = await pool.query(`
            SELECT * FROM users
            WHERE id = ${userId}
        `);

    const currentPageNum = Number(pageNum.rows[0].current_page);

    //finds the current tree that the user is on
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //finds which person if the "base" (ancestor listed at the bottom of the page) of the current page number
    const baseOfPage = await pool.query(
      `
            SELECT * FROM tree_${currentTree}
            WHERE base_of_page = ${currentPageNum}
            `
    );


    let firstName = "";
    let middleName = "";
    let lastName = "";

    if (baseOfPage.rows[0].first_name === null) {
      firstName = "UNKNOWN";
    } else {
      firstName = baseOfPage.rows[0].first_name;
    }

    if (baseOfPage.rows[0].middle_name === null) {
      middleName = "";
    } else {
      middleName = baseOfPage.rows[0].middle_name;
    }

    if (baseOfPage.rows[0].last_name === null) {
      lastName = "";
    } else {
      lastName = baseOfPage.rows[0].last_name;
    }

    const fullName = `${firstName} ${middleName} ${lastName}`;

    res.json({
      pageNum: currentPageNum,
      firstName: baseOfPage.rows[0].first_name,
      middleName: baseOfPage.rows[0].middle_name,
      lastName: baseOfPage.rows[0].last_name,
      fullName: fullName,
      id: baseOfPage.rows[0].ancestor_id,
      birthDate: baseOfPage.rows[0].date_of_birth,
      birthPlace: baseOfPage.rows[0].place_of_birth,
      deathDate: baseOfPage.rows[0].date_of_death,
      deathPlace: baseOfPage.rows[0].place_of_death,
      occupation: baseOfPage.rows[0].occupation,
      ethnicity: baseOfPage.rows[0].ethnicity,
      relationToUser: baseOfPage.rows[0].relation_to_user,
      sex: baseOfPage.rows[0].sex,
      uncertainFirstName: baseOfPage.rows[0].uncertain_first_name,
      uncertainMiddleName: baseOfPage.rows[0].uncertain_middle_name,
      uncertainLastName: baseOfPage.rows[0].uncertain_last_name,
      uncertainBirthDate: baseOfPage.rows[0].uncertain_birth_date,
      uncertainBirthPlace: baseOfPage.rows[0].uncertain_birth_place,
      uncertainDeathDate: baseOfPage.rows[0].uncertain_death_date,
      uncertainDeathPlace: baseOfPage.rows[0].uncertain_death_place,
      uncertainOccupation: baseOfPage.rows[0].uncertain_occupation,
      memberOfNobility: baseOfPage.rows[0].member_of_nobility,
    });
  } catch (error) {
    console.log("Error getting page number:", error);
  }
});

app.post("/make-new-page", async (req, res) => {
  try {
    const { userId, personID, pageNumber } = req.body;

    //finds the current tree that the user is on
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //finds what the current highest page number is, and increments it by one
    const newPage = await pool.query(`
            SELECT MAX(page_number) AS max_page
            FROM tree_${currentTree}
        `);

    const newPageNum = Number(newPage.rows[0].max_page) + 1;

    //changes page number of the person who shall be the bottom page person of the new page
    const person = await pool.query(`
            UPDATE tree_${currentTree}
            SET 
                page_number = ${newPageNum},
                base_of_page = ${newPageNum}
            WHERE ancestor_id = ${personID}
        `);

    //the previous page that the person is mentioned on is saved in previous_page
    const previous = await pool.query(`
            UPDATE tree_${currentTree}
            SET previous_page = ${pageNumber}
            WHERE ancestor_id = ${personID}
            `);
  } catch (error) {
    console.log("Error making new page: ", error);
  }
});

app.post("/count-all-pages", async (req, res) => {
  try {
    const { userId } = req.body;

    //finds the current tree that the user is on
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //finds what the current highest page number is, and increments it by on
    const newPage = await pool.query(`
            SELECT MAX(page_number) AS max_page
            FROM tree_${currentTree}
        `);

    const newPageNum = Number(newPage.rows[0].max_page);

    res.json(newPageNum);
  } catch (error) {
    console.log("Error making new page: ", error);
  }
});

app.post("/get-previous-page", async (req, res) => {
  try {
    const { userId, personID } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const previous = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${personID}
            `);

    const previousPage = Number(previous.rows[0].previous_page);

    //updates the current page number in the database
    const update = await pool.query(`
            UPDATE users
            SET current_page = ${previousPage}
            WHERE id = ${userId}
            `);

    res.json({ pageNum: previousPage });
  } catch (error) {
    console.log("Error getting previous page: ", error);
  }
});

app.post("/get-next-page", async (req, res) => {
  try {
    const { userId, personID } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //finds what page the person is at the base of
    const goUp = await pool.query(
      `
            SELECT base_of_page FROM tree_${currentTree}
            WHERE ancestor_id = ${personID}
            `
    );

    //updates the current page number in the database
    const update = await pool.query(`
            UPDATE users
            SET current_page = ${Number(goUp.rows[0].base_of_page)}
            WHERE id = ${userId}
            `);

    res.json({ pageNum: Number(goUp.rows[0].base_of_page) });
  } catch (error) {
    console.log("Error getting previous page: ", error);
  }
});

app.post("/save-ancestor", async (req, res) => {
  try {
    const { userId, ancestorDetails, childID, sex } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const ancestoridQuery = await pool.query(`
            SELECT ancestor_id FROM tree_${currentTree}
        `);

    const allAncestorIds = ancestoridQuery.rows.map((row) => row.ancestor_id);

    let ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    while (allAncestorIds.includes(ancestor_id)) {
      ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    }

    if (sex === "male") {
      const childQuery = await pool.query(`
                UPDATE tree_${currentTree}
                SET father_id = ${ancestor_id}
                WHERE ancestor_id = ${childID}
                `);
    } else if (sex === "female") {
      const childQuery = await pool.query(`
                UPDATE tree_${currentTree}
                SET mother_id = ${ancestor_id}
                WHERE ancestor_id = ${childID}
                `);
    }

    //father of bottom page person has same page number
    const pageNumQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${childID}
        `);
    const page_number = Number(pageNumQuery.rows.map((row) => row.page_number));

    const ancestorRelation = [];
    
    const relationToUserQuery = await pool.query(`
           SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${childID}
            `);

      for (let i = 0; i < relationToUserQuery.rows[0].relation_to_user.length; i++) {
        ancestorRelation.push(relationToUserQuery.rows[0].relation_to_user[i] + 1);
      }

    

    

    

    const ancestorQuery = await pool.query(
      `
            INSERT INTO tree_${currentTree} (
                first_name,
                middle_name,
                last_name,
                ancestor_id,
                page_number,
                base_person,
                sex,
                ethnicity,
                date_of_birth,
                place_of_birth,
                date_of_death,
                place_of_death,
                cause_of_death,
                occupation,
                relation_to_user,
                uncertain_first_name,
                uncertain_middle_name,
                uncertain_last_name,
                uncertain_birth_date,
                uncertain_birth_place,
                uncertain_death_date,
                uncertain_death_place,
                uncertain_occupation,
                marriage_date,
                marriage_place,
                member_of_nobility
            )  
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
            ) 
        `,
      [
        ancestorDetails.firstName,
        ancestorDetails.middleName,
        ancestorDetails.lastName,
        ancestor_id,
        page_number,
        "false",
        sex,
        ancestorDetails.ethnicity,
        ancestorDetails.birthDate,
        ancestorDetails.birthPlace,
        ancestorDetails.deathDate,
        ancestorDetails.deathPlace,
        ancestorDetails.causeOfDeath,
        ancestorDetails.occupation,
        ancestorRelation,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        ancestorDetails.marriagePlace,
        ancestorDetails.marriageDeath,
        ancestorDetails.memberOfNobility,
      ]
    );

    res.json(ancestor_id);
  } catch (error) {
    console.log("Error saving ancestor:", error);
  }
});

//determines if the great grandparent of the bottom page person has parents
app.post("/check-if-great-grandparent-has-parents", async (req, res) => {

  try {
    const { userId, greatgrandparentID } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    const request = await pool.query(
      `
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${greatgrandparentID}
            `
    );


    if (
      request.rows[0].father_id !== null||
      request.rows[0].mother_id !== null
    ) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log("Error checking greatgrandparent's parents:", error);
  }
});

app.post("/edit-person", async (req, res) => {
  try {
    const { userId, personDetails } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const ancestorQuery = await pool.query(
      `UPDATE tree_${currentTree} 
             SET
                first_name = $1,
                middle_name = $2,
                last_name = $3,
                ethnicity = $4,
                date_of_birth = $5,
                place_of_birth = $6,
                date_of_death = $7,
                place_of_death = $8,
                cause_of_death = $9,
                occupation = $10,
                member_of_nobility = $11
             WHERE ancestor_id = $12`,
      [
        personDetails.firstName,
        personDetails.middleName,
        personDetails.lastName,
        personDetails.ethnicity,
        personDetails.birthDate,
        personDetails.birthPlace,
        personDetails.deathDate,
        personDetails.deathPlace,
        personDetails.causeOfDeath,
        personDetails.occupation,
        personDetails.memberOfNobility,
        personDetails.id,
      ]
    );
  } catch (error) {
    console.log("Error saving ancestor:", error);
  }
});

app.post("/toggle-uncertain", async (req, res) => {
  try {
    const { userId, details, infoType } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const checkBoolean = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${details.id}
            `);

    let bool = "";
    switch (infoType) {
      case "first_name":
        bool = checkBoolean.rows[0].uncertain_first_name;
        break;
      case "middle_name":
        bool = checkBoolean.rows[0].uncertain_middle_name;
        break;
      case "last_name":
        bool = checkBoolean.rows[0].uncertain_last_name;
        break;
      case "birth_date":
        bool = checkBoolean.rows[0].uncertain_birth_date;
        break;
      case "birth_place":
        bool = checkBoolean.rows[0].uncertain_birth_place;
        break;
      case "death_date":
        bool = checkBoolean.rows[0].uncertain_death_date;
        break;
      case "death_place":
        bool = checkBoolean.rows[0].uncertain_death_place;
        break;
      case "occupation":
        bool = checkBoolean.rows[0].uncertain_occupation;
        break;
    }

    //toggles the boolean
    if (bool) {
      bool = false;
    } else {
      bool = true;
    }

    const ancestorQuery = await pool.query(
      `UPDATE tree_${currentTree} 
             SET
                uncertain_${infoType} = ${bool}
             WHERE ancestor_id = ${details.id}`
    );

    res.json(bool);
  } catch (error) {
    console.log("Error saving ancestor:", error);
  }
});

app.post("/delete-person", async (req, res) => {
  try {
    const { userId, personID, sex } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //removes any mention of the person's ID in anyone else's father_id or mother_id
    if (sex === "male") {
      const removeMentionAsParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET father_id = NULL
                WHERE father_id = ${personID}
            `);
    } else {
      const removeMentionAsParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET mother_id = NULL
                WHERE mother_id = ${personID}
            `);
    }

    //now that the person is no longer associated with any children, he, and all his own ancestors, may be deleted. If one of his own ancestors is a repeat ancestor, then thsi repeat ancestor will be safe from deletion thanks to only people with no listed children wil be deleted - the existence of the other descent path disqualifies repeat ancestors from this condition

    const deleteRecursively = async (ID, personSex) => {
      //find parents, store their IDs
      const findParents = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${ID}
            `);

      let fatherID = findParents.rows[0].father_id;
      let motherID = findParents.rows[0].mother_id;

      //delete person if his ID does not appear as in anyone's father_id or mother_id
      if (personSex === "male") {
        const determineIfParent = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE father_id = ${ID}
                `);

        if (determineIfParent.rows.length === 0) {
          const deletePerson = pool.query(`
                        DELETE FROM tree_${currentTree}
                        WHERE ancestor_id = ${ID}
                    `);

          //now that the person is deleted, his parents will get the same treatment. The recursion will stop if the person has no parents
          if (fatherID) {
            deleteRecursively(fatherID, "male");
          }
          if (motherID) {
            deleteRecursively(motherID, "female");
          }
        }
      } else {
        const determineIfParent = await pool.query(`
                        SELECT * FROM tree_${currentTree}
                        WHERE mother_id = ${ID}
                    `);

        if (determineIfParent.rows.length === 0) {
          const deletePerson = pool.query(`
                            DELETE FROM tree_${currentTree}
                            WHERE ancestor_id = ${ID}
                        `);

          //now that the person is deleted, his parents will get the same treatment. The recursion will stop if the person has no parents
          if (fatherID) {
            deleteRecursively(fatherID, "male");
          }
          if (motherID) {
            deleteRecursively(motherID, "female");
          }
        }
      }
    };

    deleteRecursively(personID, sex);
  } catch (error) {
    console.log("Error saving ancestor:", error);
  }
});

app.post("/ancestor-profiles", async (req, res) => {
  try {
    const { userId, id } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getPerson = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${id}
        `);

    res.json(getPerson.rows[0]);
  } catch (error) {
    console.log("Error getting ancestor's profile: ", error);
  }
});

app.post("/get-parents", async (req, res) => {
  try {
    const { userId, father, mother } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getFather = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${father}
        `);

    let motherFirstName = "";
    let motherMiddleName = "";
    let motherLastName = "";
    let motherId = "";
    if (mother) {
      const getMother = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${mother}
            `);
      motherId = getMother.rows[0].ancestor_id;

      if (getMother.rows[0].first_name === null) {
        motherFirstName = "UNKNOWN";
      } else {
        motherFirstName = getMother.rows[0].first_name;
      }

      if (getMother.rows[0].middle_name === null) {
        motherMiddleName = "";
      } else {
        motherMiddleName = getMother.rows[0].middle_name;
      }

      if (getMother.rows[0].last_name === null) {
        motherLastName = "";
      } else {
        motherLastName = getMother.rows[0].last_name;
      }
    }

    let fatherFirstName = "";
    let fatherMiddleName = "";
    let fatherLastName = "";
    let fatherId = "";
    if (father) {
      const getFather = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${father}
            `);
      fatherId = getFather.rows[0].ancestor_id;

      if (getFather.rows[0].first_name === null) {
        fatherFirstName = "UNKNOWN";
      } else {
        fatherFirstName = getFather.rows[0].first_name;
      }

      if (getFather.rows[0].middle_name === null) {
        fatherMiddleName = "";
      } else {
        fatherMiddleName = getFather.rows[0].middle_name;
      }

      if (getFather.rows[0].last_name === null) {
        fatherLastName = "";
      } else {
        fatherLastName = getFather.rows[0].last_name;
      }
    }

    const fatherName = `${fatherFirstName} ${fatherMiddleName} ${fatherLastName}`;

    const motherName = `${motherFirstName} ${motherMiddleName} ${motherLastName}`;

    res.json({
      father: fatherName,
      mother: motherName,
      fatherId: fatherId,
      motherId: motherId,
    });
  } catch (error) {
    console.log("Error getting ancestor's profile: ", error);
  }
});

app.post("/get-child", async (req, res) => {
  try {
    const { userId, id, sex } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    let childFirstName = "";
    let childMiddleName = "";
    let childLastName = "";
    let childName = [];
    let childId = [];

    let spouseFirstName = "";
    let spouseMiddleName = "";
    let spouseLastName = "";
    let spouseName = "";
    let spouseId = "";

    if (sex === "male") {
      const getChild = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE father_id = ${id}
            `);

      for (let i = 0; i < getChild.rows.length; i++) {
        childId.push(getChild.rows[i].ancestor_id);

        if (getChild.rows[i].first_name === null) {
          childFirstName = "UNKNOWN";
        } else {
          childFirstName = getChild.rows[i].first_name;
        }

        if (getChild.rows[i].middle_name === null) {
          childMiddleName = "";
        } else {
          childMiddleName = getChild.rows[i].middle_name;
        }

        if (getChild.rows[i].last_name === null) {
          childLastName = "";
        } else {
          childLastName = getChild.rows[i].last_name;
        }

        childName.push(`${childFirstName} ${childMiddleName} ${childLastName}`);
      }

      const getSpouseId = await pool.query(`
                SELECT mother_id FROM tree_${currentTree}
                WHERE ancestor_id = ${childId[0]}
            `);

      spouseId = getSpouseId.rows[0].mother_id;

      if (spouseId) {
        const getSpouse = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE ancestor_id = ${spouseId}
                `);

        if (getSpouse.rows[0].first_name === null) {
          spouseFirstName = "UNKNOWN";
        } else {
          spouseFirstName = getSpouse.rows[0].first_name;
        }

        if (getSpouse.rows[0].middle_name === null) {
          spouseMiddleName = "";
        } else {
          spouseMiddleName = getSpouse.rows[0].middle_name;
        }

        if (getSpouse.rows[0].last_name === null) {
          spouseLastName = "";
        } else {
          spouseLastName = getSpouse.rows[0].last_name;
        }

        spouseName = `${spouseFirstName} ${spouseMiddleName} ${spouseLastName}`;
      }
    } else {
      const getChild = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE mother_id = ${id}
                `);

      for (let i = 0; i < getChild.rows.length; i++) {
        childId.push(getChild.rows[i].ancestor_id);

        if (getChild.rows[i].first_name === null) {
          childFirstName = "UNKNOWN";
        } else {
          childFirstName = getChild.rows[i].first_name;
        }

        if (getChild.rows[i].middle_name === null) {
          childMiddleName = "";
        } else {
          childMiddleName = getChild.rows[i].middle_name;
        }

        if (getChild.rows[i].last_name === null) {
          childLastName = "";
        } else {
          childLastName = getChild.rows[i].last_name;
        }

        childName.push(`${childFirstName} ${childMiddleName} ${childLastName}`);
      }

      const getSpouseId = await pool.query(`
                    SELECT father_id FROM tree_${currentTree}
                    WHERE ancestor_id = ${childId[0]}
                `);

      spouseId = getSpouseId.rows[0].father_id;

      const getSpouse = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE ancestor_id = ${spouseId}
                `);

      if (getSpouse.rows[0].first_name === null) {
        spouseFirstName = "UNKNOWN";
      } else {
        spouseFirstName = getSpouse.rows[0].first_name;
      }

      if (getSpouse.rows[0].middle_name === null) {
        spouseMiddleName = "";
      } else {
        spouseMiddleName = getSpouse.rows[0].middle_name;
      }

      if (getSpouse.rows[0].last_name === null) {
        spouseLastName = "";
      } else {
        spouseLastName = getSpouse.rows[0].last_name;
      }

      spouseName = `${spouseFirstName} ${spouseMiddleName} ${spouseLastName}`;
    }

    res.json({
      childName: childName,
      spouseName: spouseName,
      childId: childId,
      spouseId: spouseId,
    });
  } catch (error) {
    console.log("Error getting ancestor's profile: ", error);
  }
});

app.post("/save-profile-text", async (req, res) => {
  try {
    const { userId, id, value } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const saveText = await pool.query(
      `
            UPDATE tree_${currentTree}
            SET profile_text = $1
            WHERE ancestor_id = ${id}
        `,
      [value]
    );
  } catch (error) {
    console.log("Error saving profile text: ", error);
  }
});

app.post("/save-source", async (req, res) => {
  try {
    const {
      userId,
      sourceNameLink,
      sourceLink,
      sourceNameText,
      sourceNameTextAuthor,
      profileData,
    } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const addSources = await pool.query(
      `
            INSERT INTO sources (tree_id, ancestor_id, source_link_name, source_link, source_text_name, source_text_author)
            VALUES ($1, $2, $3, $4, $5, $6)
            `,
      [
        currentTree,
        profileData.ancestor_id,
        sourceNameLink,
        sourceLink,
        sourceNameText,
        sourceNameTextAuthor,
      ]
    );

    res.json(true);

  } catch (error) {
    console.log("Error saving source link:", error);
  }
});

app.post("/save-edit-text-source", async (req, res) => {
  try {
    const {
      userId,
      source,
      sourceAuthor,
      previousSource, 
      previousSourceAuthor,
      profileData,
    } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const addSources = await pool.query(
      `
            UPDATE sources 
            SET
              source_text_name = $1,
              source_text_author = $2
            WHERE tree_id = $3 AND ancestor_id = $4 AND source_text_name = $5 AND source_text_author = $6
            `,
      [ 
        source,
        sourceAuthor,
        currentTree,
        profileData.ancestor_id,
        previousSource, 
        previousSourceAuthor,
      ]
    );

    res.json(true);
    
  } catch (error) {
    console.log("Error saving source link:", error);
  }
});

app.post("/get-sources", async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getSources = await pool.query(`
            SELECT * FROM sources
            WHERE tree_id = ${currentTree} and ancestor_id = ${profileData.ancestor_id}
        `);

    const source_link_name = getSources.rows.map((row) => row.source_link_name);
    const source_link = getSources.rows.map((row) => row.source_link);
    const source_text_name = getSources.rows.map((row) => row.source_text_name);
    const source_text_author = getSources.rows.map(
      (row) => row.source_text_author
    );

    const source_link_name_filtered = source_link_name.filter(
      (i) => i !== null
    );
    const source_link_filtered = source_link.filter((i) => i !== null);
    const source_text_name_filtered = source_text_name.filter(
      (i) => i !== null
    );
    const source_text_author_filtered = source_text_author.filter(
      (i) => i !== null
    );

    res.json({
      source_link_name: source_link_name_filtered,
      source_link: source_link_filtered,
      source_text_name: source_text_name_filtered,
      source_text_author: source_text_author_filtered,
    });
  } catch (error) {
    console.log("error getting sources:", error);
  }
});

app.post("/delete-source", async (req, res) => {
  try {
    const {
      userId,
      source,
      sourceName,
      profileData,
      type
    } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    if (type === "text") {

      const deleteSources = await pool.query(
        `
              DELETE FROM sources
              WHERE tree_id = $1 AND ancestor_id = $2 AND source_text_name = $3 AND source_text_author = $4
              `,
        [
          currentTree,
          profileData.ancestor_id,
          source,
          sourceName,
        ]
      );

    } else if (type === "link") {

      const deleteSources = await pool.query(
        `
              DELETE FROM sources
              WHERE tree_id = $1 AND ancestor_id = $2 AND source_link = $3 AND source_link_name = $4
              `,
        [
          currentTree,
          profileData.ancestor_id,
          source,
          sourceName,
        ]
      );
    }

    res.json(true)

    
  } catch (error) {
    console.log("Error saving source link:", error);
  }
});

app.post("/get-most-removed-ancestor", async (req, res) => {
  try {
    const { userId } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getMostRemoved = await pool.query(`
            SELECT MAX(value) AS max_relation
            FROM (
                SELECT UNNEST(relation_to_user) AS value
                FROM tree_${currentTree}
            ) AS unnested_values;
        `);

    const findAncestor = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ${getMostRemoved.rows[0].max_relation} = ANY(relation_to_user)
        `);

    let firstName = "";
    let middleName = "";
    let lastName = "";
    if (findAncestor.rows[0].first_name === null) {
      firstName = "";
    } else {
      firstName = findAncestor.rows[0].first_name;
    }
    if (findAncestor.rows[0].middle_name === null) {
      middleName = "";
    } else {
      middleName = findAncestor.rows[0].middle_name;
    }
    if (findAncestor.rows[0].last_name === null) {
      lastName = "";
    } else {
      lastName = findAncestor.rows[0].last_name;
    }

    res.json({
      name: `${firstName} ${middleName} ${lastName}`,
      link: `profile/${findAncestor.rows[0].ancestor_id}`,
      relation: findAncestor.rows[0].relation_to_user,
      sex: findAncestor.rows[0].sex,
    });
  } catch (error) {
    console.log("Error getting most removed ancestor: ", error);
  }
});

app.post("/save-progress", async (req, res) => {
  try {
    const { userId, progressNote, details } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const setProgress = await pool.query(
      `UPDATE trees
             SET 
                progress_note = $1,
                progress_id = $2
             WHERE tree_id = $3`,
      [progressNote, details.id, currentTree]
    );
  } catch (error) {
    console.log("Error saving progress:", error);
  }
});

app.post("/get-progress", async (req, res) => {
  try {
    const { userId } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getProgress = await pool.query(`
            SELECT * FROM trees
            WHERE tree_id = ${currentTree}
        `);

    const getPerson = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${getProgress.rows[0].progress_id}
        `);

      if (getProgress.rows[0].progress_id) {
        let firstName = "";
        let middleName = "";
        let lastName = "";
        if (getPerson.rows[0].first_name === null) {
          firstName = "UNKNOWN";
        } else {
          firstName = getPerson.rows[0].first_name;
        }
        if (getPerson.rows[0].middle_name === null) {
          middleName = "";
        } else {
          middleName = getPerson.rows[0].middle_name;
        }
        if (getPerson.rows[0].last_name === null) {
          lastName = "";
        } else {
          lastName = getPerson.rows[0].last_name;
        }

        let fullName = `${firstName} ${middleName} ${lastName}`;
        res.json({
          name: fullName,
          link: `profile/${getProgress.rows[0].progress_id}`,
          note: getProgress.rows[0].progress_note,
          bool: true,
        });
      
      } else {
        res.json({
          bool: false,
        });
    }
  } catch (error) {
    console.log("Error saving progress:", error);
  }
});

app.post("/remove-progress-note", async (req, res) => {
  try {
    const { userId } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getProgress = await pool.query(`
            UPDATE trees
            SET 
                progress_id = null,
                progress_note = null
            WHERE tree_id = ${currentTree}
        `);
  } catch (error) {
    console.log("Error saving progress:", error);
  }
});

app.post("/find-page-number", async (req, res) => {
  try {
    const { userId, id } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getNum = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${id}
        `);

    const pageNum = getNum.rows[0].page_number;
    res.json(pageNum);
  } catch (error) {
    console.log("error getting page number:", error);
  }
});

app.post("/search-ancestors", async (req, res) => {
  try {
    const {
      userId,
      firstName,
      middleName,
      lastName,
      birthDate,
      birthPlace,
      deathDate,
      deathPlace,
      ethnicity,
      profileNum,
    } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const results = await pool.query(
      `
            SELECT * FROM tree_${currentTree}
            WHERE 
                ($1::text IS NULL OR LENGTH($1::text) = 0 OR first_name = $1)
                AND
                ($2::text IS NULL OR LENGTH($2::text) = 0 OR middle_name = $2)
                AND
                ($3::text IS NULL OR LENGTH($3::text) = 0 OR last_name = $3)
                AND
                ($4::text IS NULL OR LENGTH($4::text) = 0 OR date_of_birth = $4)
                AND
                ($5::text IS NULL OR LENGTH($5::text) = 0 OR place_of_birth ILIKE $5)
                AND
                ($6::text IS NULL OR LENGTH($6::text) = 0 OR date_of_death = $6)
                AND
                ($7::text IS NULL OR LENGTH($7::text) = 0 OR place_of_death ILIKE $7)
                AND
                ($8::text IS NULL OR LENGTH($8::text) = 0 OR ethnicity = $8)
                AND
                ($9::int IS NULL OR $9 = 0 OR ancestor_id = $9)
                `,
      [
        firstName,
        middleName,
        lastName,
        birthDate,
        birthPlace ? `%${birthPlace}%` : null,
        deathDate,
        deathPlace ? `%${deathPlace}%` : null,
        ethnicity,
        profileNum,
      ]
    );

    const resultsArray = results.rows;

    res.json(resultsArray);
  } catch (error) {
    console.log("error searching ancestors:", error);
  }
});

app.post("/save-repeat-ancestor", async (req, res) => {

  try {
    const { userId, childDetails, repeatAncestorId } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //adds repeat ancestor's id to his/her child's father/mother_id
    const findSex = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${repeatAncestorId}
        `);

    const sex = findSex.rows[0].sex;

    if (sex === "male") {
      const addParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET father_id = ${repeatAncestorId}
                WHERE ancestor_id = ${childDetails.id}
            `);
    } else {
      const addParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET mother_id = ${repeatAncestorId}
                WHERE ancestor_id = ${childDetails.id}
            `);
    }

    const recursivelyUpdateRelation = async (child, repeatParentId, sex) => {
      let childId = "";
      if (child.id) {
        childId = child.id;
      } else {
        childId = child.ancestor_id;
      }

      //finds child
      const getPerson = await pool.query(
        `SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${childId}`
      );
      const person = getPerson.rows[0];
      //finds parents
      const getFather = await pool.query(
        `SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${person.father_id}`
      );
      const father = getFather.rows[0];
      const getMother = await pool.query(
        `SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${person.mother_id}`
      );
      const mother = getMother.rows[0];
      //finds grandparents
      let pgrandfather = "";
      let pgrandmother = "";
      let mgrandfather = "";
      let mgrandmother = "";
      if (father) {
        const getpgrandfather = await pool.query(
          `SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${father.father_id}`
        );
        pgrandfather = getpgrandfather.rows[0];
        const getpgrandmother = await pool.query(
          `SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${father.mother_id}`
        );
        pgrandmother = getpgrandmother.rows[0];
      }
      if (mother) {
        const getmgrandfather = await pool.query(
          `SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${mother.father_id}`
        );
        mgrandfather = getmgrandfather.rows[0];
        const getmgrandmother = await pool.query(
          `SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${mother.mother_id}`
        );
        mgrandmother = getmgrandmother.rows[0];
      }

      let newRelationNum = [];
      //if the function is being called for the first time, and not in any subsequent recursive call
      if (childId === childDetails.id) {
        //increments the items child's ID relation_to_user by one
        for (let i = 0; i < person.relation_to_user.length; i++) {
          newRelationNum.push(person.relation_to_user[i] + 1);
        }

        //finds the current value of the repeat ancestor's relation_to_user
        const currentValue = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE ancestor_id = ${repeatParentId}
                `);

        const currentRelationToUser = currentValue.rows[0].relation_to_user;

        //appends the new relation_to_user to the old ones
        for (let i = 0; i < currentRelationToUser.length; i++) {
          newRelationNum.push(currentRelationToUser[i]);
        }

        //this new array is then added to the repeat ancestor's relation_to_user column
        const addNewRelationNum = await pool.query(
          `
                    UPDATE tree_${currentTree}
                    SET relation_to_user = $1
                    WHERE ancestor_id = $2
                `,
          [newRelationNum, repeatParentId]
        );
      } else {
        //determine if user descends from more than one of repeat ancestor's children
        if (sex === "male") {
          const findOtherChildren = await pool.query(`
                        SELECT * FROM tree_${currentTree}
                        WHERE father_id = ${repeatParentId}
                    `);

          //find relation of all children, increment all by one and add to repeat ancestor's relation
          let repeatAncestorRelationArray = [];
          for (let i = 0; i < findOtherChildren.rows.length; i++) {
            for (
              let j = 0;
              j < findOtherChildren.rows[i].relation_to_user.length;
              j++
            ) {
              repeatAncestorRelationArray.push(
                findOtherChildren.rows[i].relation_to_user[j] + 1
              );
            }
          }

          //this new array is then added to the repeat ancestor's relation_to_user column
          const addNewRelationNum = await pool.query(
            `
                        UPDATE tree_${currentTree}
                        SET relation_to_user = $1
                        WHERE ancestor_id = $2
                    `,
            [repeatAncestorRelationArray, repeatParentId]
          );
        } else {
          const findOtherChildren = await pool.query(`
                        SELECT * FROM tree_${currentTree}
                        WHERE mother_id = ${repeatParentId}
                    `);

          //find relation of all children, increment all by one and add to repeat ancestor's relation
          let repeatAncestorRelationArray = [];
          for (let i = 0; i < findOtherChildren.rows.length; i++) {
            for (
              let j = 0;
              j < findOtherChildren.rows[i].relation_to_user.length;
              j++
            ) {
              repeatAncestorRelationArray.push(
                findOtherChildren.rows[i].relation_to_user[j] + 1
              );
            }
          }

          //this new array is then added to the repeat ancestor's relation_to_user column
          const addNewRelationNum = await pool.query(
            `
                        UPDATE tree_${currentTree}
                        SET relation_to_user = $1
                        WHERE ancestor_id = $2
                    `,
            [repeatAncestorRelationArray, repeatParentId]
          );
        }
      }

      if (pgrandfather) {
        recursivelyUpdateRelation(father, pgrandfather.ancestor_id, "male");
      }
      if (pgrandmother) {
        recursivelyUpdateRelation(father, pgrandmother.ancestor_id, "female");
      }
      if (mgrandfather) {
        recursivelyUpdateRelation(mother, mgrandfather.ancestor_id, "male");
      }
      if (mgrandmother) {
        recursivelyUpdateRelation(mother, mgrandmother.ancestor_id, "female");
      }
    };

    recursivelyUpdateRelation(childDetails, repeatAncestorId, sex);

    res.json(true)
  } catch (error) {
    console.log("Error saving repeat ancestor:", error);
  }
});

app.post("/save-profile-info", async (req, res) => {
  try {
    const { userId, profileData } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const updateProfile = await pool.query(
      `
            UPDATE tree_${currentTree}
            SET
                first_name = $1,
                middle_name = $2,
                last_name = $3,
                place_of_birth = $4,
                date_of_birth = $5,
                place_of_death = $6,
                date_of_death = $7,
                cause_of_death = $8,
                ethnicity = $9,
                alternative_names = $10,
                occupation = $11,
                paternal_haplogroup = $12,
                maternal_haplogroup = $13,
                profile_pic_caption = $14
            WHERE ancestor_id = $15
        `,
      [
        profileData.first_name,
        profileData.middle_name,
        profileData.last_name,
        profileData.place_of_birth,
        profileData.date_of_birth,
        profileData.place_of_death,
        profileData.date_of_death,
        profileData.cause_of_death,
        profileData.ethnicity,
        profileData.alternative_names,
        profileData.occupation,
        profileData.paternal_haplogroup,
        profileData.maternal_haplogroup,
        profileData.profile_pic_caption,
        profileData.ancestor_id,
      ]
    );
  } catch (error) {
    console.log("error saving profile info:", error);
  }
});

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

app.use("/calculate-ethnic-breakdown", async (req, res) => {
  try {
    const { userId, id } = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    //recursive function which determines the parent's ethnic breakdown. It first must gain the values of each deadend ancestor (hence continiously checking if a person has parents, going up one generation if he does)
    const calculateEthnicBreakdown = async (childId) => {
      let fatherEthnicityNameArray = [];
      let fatherEthnicityPercentageArray = [];
      let motherEthnicityNameArray = [];
      let motherEthnicityPercentageArray = [];
      let ethnicityNameArray = [];
      let ethnicityPercentageArray = [];

      const findParents = await pool.query(`
				SELECT * FROM tree_${currentTree}
				WHERE ancestor_id = ${childId}
			`);

      const fatherId = findParents.rows[0].father_id;
      const motherId = findParents.rows[0].mother_id;

      //checks if each parent is a deadend ancestor
      if (fatherId === null && motherId === null) {
        //is a deadend ancestor, returns ethnicity and pushes 50 to the percentage array
        ethnicityNameArray.push(findParents.rows[0].ethnicity);
        ethnicityPercentageArray.push(100);

        return [ethnicityNameArray, ethnicityPercentageArray];
      } else if (fatherId !== null && motherId === null) {
        //ancestor has a father recorded, but not a mother. Mother is assumed to have the same ethnicity as the father - thus the father's values are passed down unchanged
        const fatherEthnicity = await calculateEthnicBreakdown(fatherId);
        for (let i = 0; i < fatherEthnicity[0].length; i++) {
          fatherEthnicityNameArray.push(fatherEthnicity[0][i]);
          fatherEthnicityPercentageArray.push(fatherEthnicity[1][i]);
        }

        return [fatherEthnicityNameArray, fatherEthnicityPercentageArray];
      } else if (fatherId === null && motherId !== null) {
        //ancestor has a mother recorded, but not a father. Father is assumed to have the same ethnicity as the mother - thus the mother's values are passed down unchanged
        const motherEthnicity = await calculateEthnicBreakdown(motherId);
        for (let i = 0; i < motherEthnicity[0].length; i++) {
          motherEthnicityNameArray.push(motherEthnicity[0][i]);
          motherEthnicityPercentageArray.push(motherEthnicity[1][i]);
        }

        return [motherEthnicityNameArray, motherEthnicityPercentageArray];
      } else if (fatherId !== null && motherId !== null) {

        //both parents are recorded. The values of each parent are halved and then added together to form the child's ethnic breakdown

        const fatherEthnicity = await calculateEthnicBreakdown(fatherId);
        for (let i = 0; i < fatherEthnicity[0].length; i++) {
          fatherEthnicityNameArray.push(fatherEthnicity[0][i]);
          fatherEthnicityPercentageArray.push(fatherEthnicity[1][i]);
        }

        const motherEthnicity = await calculateEthnicBreakdown(motherId);
        for (let i = 0; i < motherEthnicity[0].length; i++) {
          motherEthnicityNameArray.push(motherEthnicity[0][i]);
          motherEthnicityPercentageArray.push(motherEthnicity[1][i]);
        }

        let childEthnicityNameArray = [];
        let childEthnicityPercentageArray = [];

        //adds father's ethnic values - dividing the percentage of each one in half
        for (let i = 0; i < fatherEthnicityNameArray.length; i++) {
          childEthnicityNameArray.push(fatherEthnicity[0][i]);
          childEthnicityPercentageArray.push(fatherEthnicity[1][i] / 2);
        }

        //adds mother's ethnic values. First must check if any of the mother's ethnicities is shared with the father
        for (let i = 0; i < motherEthnicityNameArray.length; i++) {
          if (childEthnicityNameArray.includes(motherEthnicityNameArray[i])) {
            //ethnicity is already present in child. Don't add the name again. Simply take the percentage value, half it, and add it to the percentage value already present
            const index = childEthnicityNameArray.indexOf(
              motherEthnicityNameArray[i]
            );

            childEthnicityPercentageArray[index] =
              childEthnicityPercentageArray[index] +
              motherEthnicityPercentageArray[i] / 2;

          } else {
            childEthnicityNameArray.push(motherEthnicityNameArray[i]);
            childEthnicityPercentageArray.push(
              motherEthnicityPercentageArray[i] / 2
            );
          }
        }

        return [childEthnicityNameArray, childEthnicityPercentageArray];
      }
    };

    //initial call, with the target ancestor's ID in the argument
    const ethnicity = await calculateEthnicBreakdown(id);

    res.json({
      ethnicityNameArray: ethnicity[0],
      ethnicityPercentageArray: ethnicity[1],
    });
  } catch (error) {
    console.log("error calculating ethnic breakdown:", error);
  }
});

app.use('/get-most-repeated-ancestor', async (req, res) => {
  try {
    const { userId} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;

    const getMostRepeated = await pool.query(`
      SELECT *, array_length(relation_to_user, 1) AS array_size
      FROM tree_${currentTree}
      ORDER BY array_size DESC
      LIMIT 1;
    `)

    let firstName = "";
    let middleName = "";
    let lastName = "";
    if (getMostRepeated.rows[0].first_name === null) {
      firstName = "";
    } else {
      firstName = getMostRepeated.rows[0].first_name;
    }
    if (getMostRepeated.rows[0].middle_name === null) {
      middleName = "";
    } else {
      middleName = getMostRepeated.rows[0].middle_name;
    }
    if (getMostRepeated.rows[0].last_name === null) {
      lastName = "";
    } else {
      lastName = getMostRepeated.rows[0].last_name;
    }

    res.json({
      name: `${firstName} ${middleName} ${lastName}`,
      link: `profile/${getMostRepeated.rows[0].ancestor_id}`,
      repeatedTimes: getMostRepeated.rows[0].relation_to_user.length
    })

  } catch (error) {
    console.log("Error getting most repeated ancestor:", error)
  }
});

app.use('/save-left-note', async (req, res) => {
  try {

    const {userId, leftNote, leftNoteHeadline} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const checkIfPageHasNotes = await pool.query(`
      SELECT * FROM notes
      WHERE tree_id = ${currentTree} AND page_number = ${currentPage}
      `)

    if (checkIfPageHasNotes.rows.length === 0) {
      const saveLeftNote = await pool.query(`
        INSERT INTO notes (tree_id, page_number, left_note, left_note_headline)
        VALUES ($1, $2, $3, $4)
      `, [
        currentTree,
        currentPage,
        leftNote,
        leftNoteHeadline
      ])
  
      res.json(true);
    } else {
      const saveLeftNote = await pool.query(`
        UPDATE notes 
        SET
          left_note = $3,
          left_note_headline = $4
        WHERE tree_id = $1 AND page_number = $2
      `, [
        currentTree,
        currentPage,
        leftNote,
        leftNoteHeadline
      ])
  
      res.json(true);
    }

  } catch(error) {
    console.log("Error saving left note:", error)
  }
})

app.use('/edit-left-note', async (req, res) => {
  try {

    const {userId, leftNote, leftNoteHeadline} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const editLeftNote = await pool.query(`
      UPDATE notes 
      SET 
        left_note = $3,
        left_note_headline = $4
      WHERE tree_id = $1 AND page_number = $2
      
    `, [
      currentTree,
      currentPage,
      leftNote,
      leftNoteHeadline
    ])

    res.json(true);

  } catch(error) {
    console.log("Error editing left note:", error)
  }
})

app.use('/delete-left-note', async (req, res) => {
  try {

    const {userId} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const editLeftNote = await pool.query(`
      UPDATE notes 
      SET
        left_note = null,
        left_note_headline = null
      WHERE tree_id = $1 AND page_number = $2
      
    `, [
      currentTree,
      currentPage
    ])

    res.json(true);

  } catch(error) {
    console.log("Error editing left note:", error)
  }
})

app.use('/get-left-note', async (req, res) => {
  try {

    const {userId} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const getLeftNote = await pool.query(`
      SELECT * FROM notes 
      WHERE tree_id = $1 AND page_number = $2
    `, [
      currentTree,
      currentPage,
    ])

    if (getLeftNote.rows.length > 0) {

      const leftNote = getLeftNote.rows[0].left_note
      const leftNoteHeadline = getLeftNote.rows[0].left_note_headline

      let bool = true;
      if (leftNote === null) {
        bool = false;
      }

      res.json({
        isLeftNote: bool,
        leftNote: leftNote,
        leftNoteHeadline:leftNoteHeadline
      });

  } else {
    res.json({
      isLeftNote: false,
      leftNote: null,
      leftNoteHeadline:null
    });
  }
  

  } catch(error) {
    console.log("Error saving left note:", error)
  }
})


app.use('/save-right-note', async (req, res) => {
  try {

    const {userId, rightNote, rightNoteHeadline} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const checkIfPageHasNotes = await pool.query(`
      SELECT * FROM notes
      WHERE tree_id = ${currentTree} AND page_number = ${currentPage}
      `)

    if (checkIfPageHasNotes.rows.length === 0) {
      const saveRightNote = await pool.query(`
        INSERT INTO notes (tree_id, page_number, right_note, right_note_headline)
        VALUES ($1, $2, $3, $4)
      `, [
        currentTree,
        currentPage,
        rightNote,
        rightNoteHeadline
      ])
  
      res.json(true);
    } else {
      const saveRightNote = await pool.query(`
        UPDATE notes 
        SET
          right_note = $3,
          right_note_headline = $4
        WHERE tree_id = $1 AND page_number = $2
      `, [
        currentTree,
        currentPage,
        rightNote,
        rightNoteHeadline
      ])
    }

  } catch(error) {
    console.log("Error saving right note:", error)
  }
})

app.use('/edit-right-note', async (req, res) => {
  try {

    const {userId, rightNote, rightNoteHeadline} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const editLeftNote = await pool.query(`
      UPDATE notes 
      SET 
        right_note = $3,
        right_note_headline = $4
      WHERE tree_id = $1 AND page_number = $2
      
    `, [
      currentTree,
      currentPage,
      rightNote,
      rightNoteHeadline
    ])

    res.json(true);

  } catch(error) {
    console.log("Error editing left note:", error)
  }
})

app.use('/delete-right-note', async (req, res) => {
  try {

    const {userId, rightNote} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const editRightNote = await pool.query(`
      UPDATE notes 
      SET
        right_note = null,
        right_note_headline = null
      WHERE tree_id = $1 AND page_number = $2
      
    `, [
      currentTree,
      currentPage
    ])

    res.json(true);

  } catch(error) {
    console.log("Error deleting left note:", error)
  }
})

app.use('/get-right-note', async (req, res) => {
  try {

    const {userId} = req.body;

    // Query to get the current tree
    const getCurrentTreeId = await pool.query(
      "SELECT current_tree_id FROM users WHERE id = $1",
      [userId]
    );

    const currentTree = getCurrentTreeId.rows[0].current_tree_id;
    
    // Query to get the current page
    const getCurrentPage = await pool.query(
      "SELECT current_page FROM users WHERE id = $1",
      [userId]
    );

    const currentPage = getCurrentPage.rows[0].current_page;

    const getRightNote = await pool.query(`
      SELECT * FROM notes 
      WHERE tree_id = $1 AND page_number = $2
    `, [
      currentTree,
      currentPage,
    ])

    if (getRightNote.rows.length > 0) {

      const rightNote = getRightNote.rows[0].right_note
      const rightNoteHeadline = getRightNote.rows[0].right_note_headline

      let bool = true;
      if (rightNote === null) {
        bool = false;
      }

      res.json({
        isRightNote: bool,
        rightNote: rightNote,
        rightNoteHeadline:rightNoteHeadline
      });

  } else {
    res.json({
      isLeftNote: false,
      leftNote: null,
      leftNoteHeadline:null
    });
  }
  

  } catch(error) {
    console.log("Error saving right note:", error)
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
