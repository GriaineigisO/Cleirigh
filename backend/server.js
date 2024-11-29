const express = require('express');
const cors = require('cors');
const { Pool } = require ('pg');
require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cleirighUserDB = require('./db');

const corsOptions = {
    origin: 'http://localhost:3000', // Allow only this origin
    methods: 'GET,HEAD,POST,PUT,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
};


const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(session({
    secret: 'enter secret key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //Check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists'});
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //insert new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, id) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, Date.now()]
        );

        //generate token for user
        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h'});

        //respond with token and user data
        res.json({
            token,
            user: {
                id: newUser.rows[0].id,
                username: newUser.rows[0].username,
                email: newUser.rows[0].email
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        //find user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        //compare password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        };

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated:', token);

        //respond with token and user data
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'server error' });
    };
});

//checks if user has a paid account or not
app.get('/api/user', async (req, res) => {
    const username = req.query.username;
    try {
        const result = await cleirighUserDB.query('SELECT premium FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            const premium = result.rows[0].premium;
            res.json({ premium });
        } else {
            res.status(404).json({ message: 'user not found'});
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ message: 'Internal server error'});
    }
});

// makes a new tree
app.post('/make-new-tree', async (req, res) => {
    try {
      const { userId, treeName, treeId } = req.body; // Expecting the logged-in user's ID in the request body
  
      //inserts new tree into trees
      const result = await pool.query('INSERT INTO trees (user_id, tree_name, tree_id) VALUES ($1, $2, $3) RETURNING *',
            [userId, treeName, treeId]);

    //creates a new table which will contain the actual tree's data (regarding ancestors in it)
    const makeNewTreeTable = await pool.query(
        `CREATE TABLE tree_${treeId} (
            first_name TEXT DEFAULT NULL,
            middle_name TEXT DEFAULT NULL,
            last_name TEXT DEFAULT NULL,
            ancestor_id INT PRIMARY KEY,
            page_number INT, 
            base_person BOOLEAN DEFAULT false,
            sex TEXT DEFAULT "male", 
            ethnicity TEXT DEFAULT NULL, 
            date_of_birth DATE DEFAULT NULL, 
            place_of_birth TEXT DEFAULT NULL, 
            date_of_death DATE DEFAULT NULL, 
            place_of_death TEXT DEFAULT NULL, 
            cause_of_death TEXT DEFAULT NULL, 
            occupation TEXT DEFAULT NULL, 
            father_id INT DEFAULT NULL, 
            mother_id INT DEFAULT NULL,
            UNIQUE (ancestor_id)
            )
        `);
            
      // Get the newly created tree data
      const newTree = result.rows[0];  

      // Send a response with a 201 status and the new tree's details
      res.status(201).json({
          success: true,
          message: 'Tree created successfully',
          tree: {treeId: newTree.treeId}
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });


//determines if the user has not made a tree yet
app.post('/check-if-no-trees', async (req, res) => {
    try {
      const { userId } = req.body; 
  
      const result = await pool.query('SELECT user_id FROM trees WHERE user_id = $1',
            [userId]);

        if (result.rows.length > 0) {
            res.json({ hasTrees: true });
            } else {
            // User has no trees, return false
            res.json({ hasTrees: false });
            }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });

//gets the name of a user's tree
app.post('/get-tree-name', async (req, res) => {
    try {
      const { userId } = req.body; 
  
      const result = await pool.query('SELECT * FROM trees WHERE user_id = $1',
            [userId]);

            if (result.rows.length > 0) {
                res.json({ treeName: result.rows[0].tree_name });
            } else {
                res.status(404).json({ message: 'No trees found for this user' });
            }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });


// Updates the current tree for the user
app.post('/set-current-tree', async (req, res) => {
    try {
        const { userId, treeId } = req.body; 

        if (!userId || !treeId) {
            return res.status(400).json({ error: 'Missing userId or treeId' });
        }

        // Update the current_tree column for the user
        const result = await pool.query(
            'UPDATE users SET current_tree_id = $1 WHERE id = $2 RETURNING current_tree_id',
            [treeId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found or update failed' });
        }

        res.status(200).json({
            success: true,
            message: 'Current tree updated successfully',
            currentTree: result.rows[0].current_tree,
        });
    } catch (err) {
        console.error('Error updating current tree:', err.message);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Fetch the current tree for the user
app.post('/get-current-tree', async (req, res) => {
    try {
        const { userId } = req.body; 

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // Query to get the current tree
        const result = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            currentTree: result.rows[0].current_tree_id,
        });
    } catch (err) {
        console.error('Error fetching current tree:', err.message);
        res.status(500).json({ error: 'Database query failed' });
    }
});

  
//check if the currently selected tree is empty
app.post('/check-if-tree-empty', async (req, res) => {
    try {
        const { currentTree } = req.body; 
        
        if (!currentTree) {
            return res.status(400).json({ error: 'No valid tree provided' });
        }

        const treeTableName = `tree_${currentTree}`; // Dynamic table name

        const result = await pool.query(`SELECT * FROM ${treeTableName}`);
        if (result.rows.length > 0) {
            res.json({ isEmpty: false });
        } else {
            res.json({ isEmpty: true })
        }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query failed' });
    }
});

//adds the very first person to the tree as a base user
app.post('/add-first-person', async (req, res) => {
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
            currentTree
        } = req.body;

        // Make random six-digit number for ancestor_id
        const ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
        const page_number = 1;
        const base_person = true;  

        //if birthdate was not given, date is set to 31st Dec 1001 (which will be printed to the screen was UNKNOWN)
        let dateOfBirth = "";
        if (birthDate.length === 0) {
            date = new Date(1001, 0, 0);
            dateOfBirth = date.toISOString().split('T')[0];
        } else {
            dateOfBirth = birthDate;
        }

        //if deathdate was not given, date is set to 31st Dec 1001 (which will be printed to the screen was UNKNOWN)
        let dateOfDeath = "";
        if (deathDate.length === 0) {
            date = new Date(1001, 0, 0);
            dateOfDeath = date.toISOString().split('T')[0];
        } else {
            dateOfDeath = deathDate;
        }

        // Use parameterized queries to avoid issues with data types
        const firstPersonQuery = await pool.query(`
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
                occupation
            )  
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            ) 
        `, [
            firstName,
            middleName,
            lastName,
            ancestor_id,
            page_number,
            base_person, 
            sex,
            ethnicity,
            dateOfBirth,
            birthPlace,
            dateOfDeath,
            deathPlace,
            deathCause,
            occupation
        ]);

        res.status(200).json({ message: 'First person added successfully!' });

    } catch (error) {
        console.log('Error adding first person:', error);
        res.status(500).json({ error: 'Error adding first person.' });
    }
});

//counts the amount of ancestors in the tree, not including the base person
app.post('/count-ancestors', async (req, res) => {
    try {
        const { currentTree } = req.body;

        const result = await pool.query(`
            SELECT * FROM tree_${currentTree}
        `)

        res.json(result.rows.length - 1);

    } catch (error) {
        console.log('Error counting ancestors:', error)
    }
})

//counts the amount of places mentioned in the tree
app.post('/count-places', async (req, res) => {
    try {
        const { currentTree } = req.body;

        if (!currentTree) {
            return res.status(400).json({ error: 'Invalid tree identifier places' });
        }
        

        const birthPlace = await pool.query(`
            SELECT place_of_birth FROM tree_${currentTree}
            WHERE place_of_birth IS NOT NULL
        `)

        // Extract an array of place_of_birth values
        const birthPlaces = birthPlace.rows.map(row => row.place_of_birth);

        //if the placename includes wider areas like "Leuchars, Fife, Scotland" then only the first placename shall be extracted
        for (let i = 0; i < birthPlaces.length; i++) {
            for (let j = 0; j < birthPlaces[i].length; j++) {
                if (birthPlaces[i][j] === ",") {
                    birthPlaces[i] = birthPlaces[i].splice(0, j);
                    continue;
                }
            }
        }

        const deathPlace = await pool.query(`
            SELECT place_of_death FROM tree_${currentTree}
            WHERE place_of_death IS NOT NULL
        `)

        // Extract an array of place_of_birth values
        const deathPlaces = deathPlace.rows.map(row => row.place_of_death);

        const allPlacesArray = birthPlaces.concat(deathPlaces);

        //filters empty arrays which are the result of the birth or death place being left blank
        const filteredArray = allPlacesArray.filter((i) => i !== "");
        const allPlacesJoined = filteredArray.join(", ")

        res.json({
            numOfPlaces: filteredArray.length,
            listOfPlaces: allPlacesJoined
        });

    } catch (error) {
        console.log('Error counting places:', error)
    }
})

//counts the amount of places mentioned in the tree
app.post('/count-occupations', async (req, res) => {
    try {
        const { currentTree } = req.body;
        if (!currentTree) {
            return res.status(400).json({ error: 'Invalid tree identifier occupations' });
        }
        
        const occupations = await pool.query(`
            SELECT occupation FROM tree_${currentTree}
            WHERE occupation IS NOT NULL
        `)

        const occupationList = occupations.rows.map(row => row.occupation);
        const occupationJoined = occupationList.join(", ")


        res.json({
            numOfOccupations: occupationList.length,
            listOfOccupations: occupationJoined
        });

    } catch (error) {
        console.log('Error counting occupations:', error)
    }
})

//gets a list of all ancestors and basic info of them
app.post('/get-all-ancestors', async (req, res) => {
    try {

        const { userId } = req.body; 

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;
        
        const result = await pool.query(`
            SELECT * FROM tree_${currentTree}
        `);

        const firstNames = result.rows.map(row => row.first_name);
        const middleNames = result.rows.map(row => row.middle_name);
        const lastNames = result.rows.map(row => row.last_name);
        const sexes = result.rows.map(row => row.sex);
        const datesOfBirth = result.rows.map(row => row.date_of_birth);
        const placesOfBirth = result.rows.map(row => row.place_of_birth);
        const datesOfDeath = result.rows.map(row => row.date_of_death);
        const placesOfDeath = result.rows.map(row => row.place_of_death);
        const ethnicities = result.rows.map(row => row.ethnicity);
        const basePerson = result.rows.map(row => row.base_person);

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
            basePerson: basePerson
        })



    } catch (error) {
        console.log('Error creating profile list:', error)
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})