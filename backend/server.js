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
const e = require('express');

const corsOptions = {
    origin: 'http://localhost:3000', // Allow only this origin
    methods: 'GET,HEAD,POST,PUT,DELETE', // Allowed HTTP methods
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
            base_of_page INT DEFAULT NULL,
            previous_page INT DEFAULT NULL,
            base_person BOOLEAN DEFAULT false,
            sex TEXT DEFAULT NULL, 
            ethnicity TEXT DEFAULT NULL, 
            date_of_birth TEXT DEFAULT NULL, 
            place_of_birth TEXT DEFAULT NULL, 
            date_of_death TEXT DEFAULT NULL, 
            place_of_death TEXT DEFAULT NULL, 
            cause_of_death TEXT DEFAULT NULL, 
            occupation TEXT DEFAULT NULL, 
            father_id INT DEFAULT NULL, 
            mother_id INT DEFAULT NULL,
            relation_to_user INT[] DEFAULT NULL,
            uncertain_first_name BOOLEAN DEFAULT false,
            uncertain_middle_name BOOLEAN DEFAULT false,
            uncertain_last_name BOOLEAN DEFAULT false,
            uncertain_birth_date BOOLEAN DEFAULT false,
            uncertain_birth_place BOOLEAN DEFAULT false,
            uncertain_death_date BOOLEAN DEFAULT false,
            uncertain_death_place BOOLEAN DEFAULT false,
            uncertain_occupation BOOLEAN DEFAULT false,
            marriage_date TEXT DEFAULT NULL,
            marriage_place TEXT DEFAULT NULL,
            member_of_nobility BOOLEAN DEFAULT FALSE,
            profile_text TEXT DEFAULL NULL,
            source_name_array TEXT [] DEFAULT NULL,
            source_name_text_array TEXT [] DEFAULT NULL,
            source_link_array TEXT [] DEFAULT NULL,
            alternative_names TEXT DEFAULT NULL,
            paternal_haplogroup TEXT DEFAULT NULL,
            maternal_haplogroup TEXT DEFAULT NULL,
            source_text_author_array TEXT DEFAULT NULL
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
  
    //   const result = await pool.query('SELECT * FROM trees WHERE user_id = $1',
    //         [userId]);

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id

        //find tree in the trees tables
        const getName = await pool.query(`
            SELECT * FROM trees WHERE tree_id = ${currentTree}
        `)

        const treeName = getName.rows[0].tree_name;

        res.json({treeName:treeName})

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

    
        const firstPersonQuery = await pool.query(`
            INSERT INTO tree_${currentTree} (
                first_name,
                middle_name,
                last_name,
                ancestor_id,
                page_number,
                base_person,
                base_of_page,
                sex,
                ethnicity,
                date_of_birth,
                place_of_birth,
                date_of_death,
                place_of_death,
                cause_of_death,
                occupation,
                relation_to_user
            )  
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
            ) 
        `, [
            firstName,
            middleName,
            lastName,
            ancestor_id,
            page_number,
            base_person, 
            1,
            sex,
            ethnicity,
            birthDate,
            birthPlace,
            deathDate,
            deathPlace,
            deathCause,
            occupation,
            0
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
                    birthPlaces[i] = birthPlaces[i].slice(0, j);
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

        for (let i = 0; i < deathPlaces.length; i++) {
            for (let j = 0; j < deathPlaces[i].length; j++) {
                if (deathPlaces[i][j] === ",") {
                    deathPlaces[i] = deathPlaces[i].slice(0, j);
                    continue;
                }
            }
        }

        const allPlacesArray = birthPlaces.concat(deathPlaces);

        //filters empty arrays which are the result of the birth or death place being left blank
        const filteredArray = allPlacesArray.filter((i) => i !== "");

        //filters out duplicates
        let filteredNoDuplicatedArray = [];
        for(let i = 0; i < filteredArray.length; i++) {
            if(filteredNoDuplicatedArray.includes(filteredArray[i]) === false) {
                filteredNoDuplicatedArray.push(filteredArray[i]);
            };
        };

        let arrayLength = filteredNoDuplicatedArray.length;

        if (filteredNoDuplicatedArray.length > 20) {
            filteredNoDuplicatedArray = filteredNoDuplicatedArray.slice(0, 20);
            filteredNoDuplicatedArray.push("and more...")
        }
       

        const allPlacesJoined = filteredNoDuplicatedArray.join(", ")

        res.json({
            numOfPlaces: arrayLength,
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

        //filters out duplicates
        let filteredNoDuplicatedArray = [];
        for(let i = 0; i < occupationList.length; i++) {
            if(filteredNoDuplicatedArray.includes(occupationList[i]) === false) {
                filteredNoDuplicatedArray.push(occupationList[i]);
            };
        };

        let occupationArrayLength = filteredNoDuplicatedArray.length;
        
        if (occupationArrayLength > 20) {
            filteredNoDuplicatedArray = filteredNoDuplicatedArray.slice(0, 20);
            filteredNoDuplicatedArray.push("and more...")
        }

        const occupationJoined = filteredNoDuplicatedArray.join(", ")

        res.json({
            numOfOccupations: occupationArrayLength,
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

//gets a list of all trees that a user has
app.post('/get-all-trees', async (req, res) => {
    try {

        const { userId } = req.body; 

        // Query to get the current tree
        const allTrees = await pool.query(
            'SELECT *FROM trees WHERE user_id = $1',
            [userId]
        );

        const treeName = allTrees.rows.map(row => row.tree_name);
        const treeID = allTrees.rows.map(row => row.tree_id);
        
        res.json({
            treeName:treeName,
            treeID:treeID
        })

    } catch (error) {
        console.log('Error getting list of all trees:', error)
    }
})

app.post('/switch-trees', async (req, res) => {
    try {
        const { userId, treeId } = req.body;
        

        const switchTree = await pool.query(`
            UPDATE users
            SET current_tree_id = ${treeId}
            WHERE id = ${userId}
        `)

        res.json(true)
        

    } catch (error) {
        console.log("Error switching trees: ", error)
    }
})

//gets the first name of the base person
app.post('/get-base-person', async (req, res) => {
    try {
        const { userId } = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const baseUserquery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE base_person = true
            `)

        const fullName = `${baseUserquery.rows[0].first_name} ${baseUserquery.rows[0].middle_name} ${baseUserquery.rows[0].last_name}`;

        res.json({
            firstName:baseUserquery.rows[0].first_name,
            middleName:baseUserquery.rows[0].middle_name,
            lastName:baseUserquery.rows[0].last_name,
            id:baseUserquery.rows[0].ancestor_id,
            fullName: fullName,
            birthDate: baseUserquery.rows[0].date_of_birth,
            birthPlace: baseUserquery.rows[0].place_of_birth,
            deathDate: baseUserquery.rows[0].date_of_death,
            deathPlace: baseUserquery.rows[0].place_of_death,
            occupation: baseUserquery.rows[0].occupation,
            ethnicity: baseUserquery.rows[0].ethnicity,
            profileNumber:baseUserquery.rows[0].ancestor_id,
            sex:baseUserquery.rows[0].sex_id,
            memberOfNobility:baseUserquery.rows[0].member_of_nobility
        })

    } catch (error) {
        console.log("Error getting base user's name:", error)
    }
})

//gets the father of the person at the bottom of a tree chart
app.post('/get-father', async (req, res) => {
    try {
        const { userId, personID } = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        //finds the IDs of the person's parents
        const parentQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${personID}
            `)

        const fatherID = parentQuery.rows[0].father_id;

        //find all other data on parents using their IDs
        const fatherQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${fatherID}
        `)

        let fatherFirstName = "";
        let fatherMiddleName = "";
        let fatherLastName = "";

        if(fatherID  && fatherQuery.rows[0]) {
            if (fatherQuery.rows[0].first_name === null ) {
                fatherFirstName = "UNKNOWN";
            } else {
                fatherFirstName = fatherQuery.rows[0].first_name;
            }

            if (fatherQuery.rows[0].middle_name === null) {
                fatherMiddleName = "";
            } else {
                fatherMiddleName = fatherQuery.rows[0].middle_name;
            }

            if (fatherQuery.rows[0].last_name === null) {
                fatherLastName = "";
            } else {
                fatherLastName = fatherQuery.rows[0].last_name;
            }

            const fatherFullName = `${fatherFirstName} ${fatherMiddleName} ${fatherLastName}`;

            res.json({
                fatherID:fatherID,
                fatherFullName:fatherFullName,
                fatherFirstName: fatherFirstName,
                fatherMiddleName: fatherMiddleName,
                fatherLastName:fatherLastName,
                fatherBirthDate:fatherQuery.rows[0].date_of_birth,
                fatherBirthPlace:fatherQuery.rows[0].place_of_birth,
                fatherDeathDate:fatherQuery.rows[0].date_of_death,
                fatherDeathPlace:fatherQuery.rows[0].place_of_death,
                fatherOccupation:fatherQuery.rows[0].occupation,
                fatherProfileNumber:fatherQuery.rows[0].ancestor_id,
                fatherEthnicity:fatherQuery.rows[0].ethnicity,
                fatherCauseOfDeath:fatherQuery.rows[0].cause_of_death,
                relation_to_user:fatherQuery.rows[0].relation_to_user,
                uncertainFirstName:fatherQuery.rows[0].uncertain_first_name,
                uncertainMiddleName:fatherQuery.rows[0].uncertain_middle_name,
                uncertainLastName:fatherQuery.rows[0].uncertain_last_name,
                uncertainBirthDate:fatherQuery.rows[0].uncertain_birth_date,
                uncertainBirthPlace:fatherQuery.rows[0].uncertain_birth_place,
                uncertainDeathDate:fatherQuery.rows[0].uncertain_death_date,
                uncertainDeathPlace:fatherQuery.rows[0].uncertain_death_place,
                uncertainOccupation:fatherQuery.rows[0].uncertain_occupation,
                pageNum:fatherQuery.rows[0].base_of_page,
                memberOfNobility:fatherQuery.rows[0].member_of_nobility
            })
        }


    } catch (error) {
        console.log("Error getting father:", error)
    }
})

//gets the mother of the person at the bottom of a tree chart
app.post('/get-mother', async (req, res) => {
    try {
        const { userId, personID } = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        //finds the IDs of the person's parents
        const parentQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${personID}
            `)

        const motherID = parentQuery.rows[0].mother_id;

        const motherQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${motherID}
        `)

        let motherFirstName = "";
        let motherMiddleName = "";
        let motherLastName = "";

        if(motherID && motherQuery.rows[0]) {
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
                motherID:motherID,
                motherFullName:motherFullName,
                motherFirstName: motherFirstName,
                motherMiddleName:motherMiddleName,
                motherLastName:motherLastName,
                motherBirthDate:motherQuery.rows[0].date_of_birth,
                motherBirthPlace:motherQuery.rows[0].place_of_birth,
                motherDeathDate:motherQuery.rows[0].date_of_death,
                motherDeathPlace:motherQuery.rows[0].place_of_death,
                motherOccupation:motherQuery.rows[0].occupation,
                motherProfileNumber:motherQuery.rows[0].ancestor_id,
                motherEthnicity:motherQuery.rows[0].ethnicity,
                motherCauseOfDeath:motherQuery.rows[0].cause_of_death,
                relation_to_user:motherQuery.rows[0].relation_to_user,
                uncertainFirstName:motherQuery.rows[0].uncertain_first_name,
                uncertainMiddleName:motherQuery.rows[0].uncertain_middle_name,
                uncertainLastName:motherQuery.rows[0].uncertain_last_name,
                uncertainBirthDate:motherQuery.rows[0].uncertain_birth_date,
                uncertainBirthPlace:motherQuery.rows[0].uncertain_birth_place,
                uncertainDeathDate:motherQuery.rows[0].uncertain_death_date,
                uncertainDeathPlace:motherQuery.rows[0].uncertain_death_place,
                uncertainOccupation:motherQuery.rows[0].uncertain_occupation,
                pageNum:motherQuery.rows[0].base_of_page,
                memberOfNobility:motherQuery.rows[0].member_of_nobility
            })
        }

    } catch (error) {
        console.log("Error getting mother:", error)
    }
})

app.post('/set-current-page-number', async (req, res) => {
    try {
        const {userId, num} = req.body;


        const setNum = await pool.query(`
            UPDATE users    
            SET current_page = ${num}
            WHERE id = ${userId}
        `)
        
        res.json(true)

    } catch (error) {
        console.log("Error setting page number:", error)
    }
})

app.post('/get-current-page-number', async (req, res) => {
    try {
        const {userId} = req.body;

        //finds the latest current page number saved to the user db
        const pageNum = await pool.query(`
            SELECT * FROM users
            WHERE id = ${userId}
        `)

        const currentPageNum = Number(pageNum.rows[0].current_page)

        //finds the current tree that the user is on
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;


        //finds which person if the "base" (ancestor listed at the bottom of the page) of the current page number
        const baseOfPage = await pool.query(
            `
            SELECT * FROM tree_${currentTree}
            WHERE base_of_page = ${currentPageNum}
            `
        )

        let firstName = "";
        let middleName = "";
        let lastName = "";

        if (baseOfPage.rows[0].first_name === null ) {
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
            uncertainFirstName:baseOfPage.rows[0].uncertain_first_name,
            uncertainMiddleName:baseOfPage.rows[0].uncertain_middle_name,
            uncertainLastName:baseOfPage.rows[0].uncertain_last_name,
            uncertainBirthDate:baseOfPage.rows[0].uncertain_birth_date,
            uncertainBirthPlace:baseOfPage.rows[0].uncertain_birth_place,
            uncertainDeathDate:baseOfPage.rows[0].uncertain_death_date,
            uncertainDeathPlace:baseOfPage.rows[0].uncertain_death_place,
            uncertainOccupation:baseOfPage.rows[0].uncertain_occupation,
            memberOfNobility:baseOfPage.rows[0].member_of_nobility,
            
        })
        
    } catch (error) {
        console.log("Error getting page number:", error)
    }
})

app.post('/make-new-page', async (req, res) => {
    try {
        const {userId, personID, pageNumber} = req.body;

        //finds the current tree that the user is on
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
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
            `)

        } catch (error) {
            console.log("Error making new page: ", error)
        }
})

app.post('/count-all-pages', async (req, res) => {
    try {
        const {userId} = req.body;

        //finds the current tree that the user is on
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        //finds what the current highest page number is, and increments it by on
        const newPage = await pool.query(`
            SELECT MAX(page_number) AS max_page
            FROM tree_${currentTree}
        `);
        
        const newPageNum = Number(newPage.rows[0].max_page);

        res.json(newPageNum)

        } catch (error) {
            console.log("Error making new page: ", error)
        }
})


app.post('/get-previous-page', async (req, res) => {

    try {
        const {userId, personID} = req.body;
    
        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;


        const previous = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${personID}
            `)

        const previousPage = Number(previous.rows[0].previous_page);


        //updates the current page number in the database
        const update = await pool.query(`
            UPDATE users
            SET current_page = ${previousPage}
            WHERE id = ${userId}
            `)

        res.json({pageNum: previousPage});
        

    } catch (error) {
        console.log("Error getting previous page: ", error)
    }
})

app.post('/get-next-page', async (req, res) => {
    try {
        const {userId, personID} = req.body;
    
        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        //finds what page the person is at the base of
        const goUp = await pool.query(
            `
            SELECT base_of_page FROM tree_${currentTree}
            WHERE ancestor_id = ${personID}
            `    
        )


        //updates the current page number in the database
        const update = await pool.query(`
            UPDATE users
            SET current_page = ${Number(goUp.rows[0].base_of_page)}
            WHERE id = ${userId}
            `)

        res.json({pageNum: Number(goUp.rows[0].base_of_page)});
        

    } catch (error) {
        console.log("Error getting previous page: ", error)
    }
})


app.post('/save-ancestor', async (req, res) => {
 
    try {

    const { userId, ancestorDetails, childID, sex} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const ancestoridQuery = await pool.query(`
            SELECT ancestor_id FROM tree_${currentTree}
        `)

        const allAncestorIds = ancestoridQuery.rows.map(row => row.ancestor_id);

        let ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
        while (allAncestorIds.includes( ancestor_id)) {
            ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
        }
        
        if (sex === "male") {
            const childQuery = await pool.query(`
                UPDATE tree_${currentTree}
                SET father_id = ${ancestor_id }
                WHERE ancestor_id = ${childID}
                `)
        } else if (sex === "female") {
            const childQuery = await pool.query(`
                UPDATE tree_${currentTree}
                SET mother_id = ${ancestor_id }
                WHERE ancestor_id = ${childID}
                `)
        }      

        //father of bottom page person has same page number
        const pageNumQuery = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${childID}
        `)
        const page_number = Number(pageNumQuery.rows.map(row => row.page_number));

        const relationToUserQuery = await pool.query(`
           SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${childID}
            `)

        const ancestorRelation = []
        
        ancestorRelation.push(Number(relationToUserQuery.rows.map(row => row.relation_to_user)) + 1);

        const ancestorQuery = await pool.query(`
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
        `, [
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
        ]);

        res.json(ancestor_id)
    } catch (error) {
        console.log("Error saving ancestor:", error)
    }
})

//determines if the great grandparent of the bottom page person has parents
app.post('/check-if-great-grandparent-has-parents', async (req, res) => {
    try {
        const { userId, greatgrandparentID } = req.body;
        

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;
        const request = await pool.query(
            `
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${greatgrandparentID}
            `
        )
        
        if (request.rows[0].father_id === null && request.rows[0].mother_id === null) {
            res.json(false)
        } else {
            res.json(true);
        }
        

    } catch (error) {
        console.log("Error checking greatgrandparent's parents:", error)
    }
});


app.post('/edit-person', async (req, res) => {
    try {

    const { userId, personDetails} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
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
                personDetails.id
            ]
        );
        

    } catch (error) {
        console.log("Error saving ancestor:", error)
    }
})

app.post('/toggle-uncertain', async (req, res) => {
    try {

    const { userId, details, infoType} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const checkBoolean = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${details.id}
            `)

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
        };
        
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
             WHERE ancestor_id = ${details.id}`,
        );

        res.json(bool);
        

    } catch (error) {
        console.log("Error saving ancestor:", error)
    }
})

app.post('/delete-person', async (req, res) => {

    try {

    const { userId, personID, sex} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        //removes any mention of the person's ID in anyone else's father_id or mother_id
        if (sex === "male") {
            const removeMentionAsParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET father_id = NULL
                WHERE father_id = ${personID}
            `)
        } else {
            const removeMentionAsParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET mother_id = NULL
                WHERE mother_id = ${personID}
            `)
        }

      
        //now that the person is no longer associated with any children, he, and all his own ancestors, may be deleted. If one of his own ancestors is a repeat ancestor, then thsi repeat ancestor will be safe from deletion thanks to only people with no listed children wil be deleted - the existence of the other descent path disqualifies repeat ancestors from this condition

        const deleteRecursively = async (ID, personSex) => {

            //find parents, store their IDs
            const findParents = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${ID}
            `)           

            let fatherID = findParents.rows[0].father_id;
            let motherID = findParents.rows[0].mother_id;

            //delete person if his ID does not appear as in anyone's father_id or mother_id
            if (personSex === "male") {

                const determineIfParent = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE father_id = ${ID}
                `)

                if (determineIfParent.rows.length === 0) {
                    const deletePerson = pool.query(`
                        DELETE FROM tree_${currentTree}
                        WHERE ancestor_id = ${ID}
                    `)

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
                    `)
    
                    if (determineIfParent.rows.length === 0) {
                        const deletePerson = pool.query(`
                            DELETE FROM tree_${currentTree}
                            WHERE ancestor_id = ${ID}
                        `)

                        //now that the person is deleted, his parents will get the same treatment. The recursion will stop if the person has no parents
                        if (fatherID) {
                            deleteRecursively(fatherID, "male");
                        }
                        if (motherID) {
                            deleteRecursively(motherID, "female");
                        }
                    }
                }
        }

        deleteRecursively(personID, sex);
 
    } catch (error) {
        console.log("Error saving ancestor:", error)
    }
})

app.post('/ancestor-profiles', async (req, res) => {
    try {
        const {userId, id} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const getPerson = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${id}
        `)

        res.json(getPerson.rows[0]);

    } catch (error) {
        console.log("Error getting ancestor's profile: " , error)
    }
})

app.post('/get-parents', async (req, res) => {
    try {

        const {userId, father, mother} = req.body

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const getFather = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${father}
        `)

        let motherFirstName = "";
        let motherMiddleName = "";
        let motherLastName = "";
        let motherId="";
        if (mother) {
            const getMother = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${mother}
            `)
            motherId = getMother.rows[0].ancestor_id;

            if (getMother.rows[0].first_name === null ) {
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
        let fatherId="";
        if (father) {
            const getFather = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE ancestor_id = ${father}
            `)
                fatherId = getFather.rows[0].ancestor_id;

            if (getFather.rows[0].first_name === null ) {
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

        const motherName = `${motherFirstName} ${motherMiddleName} ${motherLastName}`;;

        res.json({
            father:fatherName,
            mother:motherName,
            fatherId:fatherId,
            motherId:motherId,
        });

    } catch (error) {
        console.log("Error getting ancestor's profile: " , error)
    }
})

app.post('/get-child', async (req, res) => {
    try {

        const {userId, id, sex} = req.body

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        let childFirstName = "";
        let childMiddleName = "";
        let childLastName = "";
        let childName = [];
        let childId= [];

        let spouseFirstName = "";
        let spouseMiddleName = "";
        let spouseLastName = "";
        let spouseName = "";
        let spouseId="";

        if (sex === "male") {

            const getChild = await pool.query(`
                SELECT * FROM tree_${currentTree}
                WHERE father_id = ${id}
            `)

            for ( let i = 0; i < getChild.rows.length; i++) {
                childId.push(getChild.rows[i].ancestor_id);

                if (getChild.rows[i].first_name === null ) {
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
            `)

            spouseId = getSpouseId.rows[0].mother_id;

            if (spouseId) {

                const getSpouse = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE ancestor_id = ${spouseId}
                `)           

                if (getSpouse.rows[0].first_name === null ) {
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
                `)
    
                for ( let i = 0; i < getChild.rows.length; i++) {
                    childId.push(getChild.rows[i].ancestor_id);
    
                    if (getChild.rows[i].first_name === null ) {
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
                `)
    
                spouseId = getSpouseId.rows[0].father_id;
    
                const getSpouse = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE ancestor_id = ${spouseId}
                `)           
    
                if (getSpouse.rows[0].first_name === null ) {
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
            childName:childName,
            spouseName:spouseName,
            childId:childId,
            spouseId:spouseId,
        });

    } catch (error) {
        console.log("Error getting ancestor's profile: " , error)
    }
})

app.post('/save-profile-text' , async (req, res) => {
    try {

        const {userId, id, value} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const saveText = await pool.query(`
            UPDATE tree_${currentTree}
            SET profile_text = $1
            WHERE ancestor_id = ${id}
        `, [value])

    } catch(error) {
        console.log("Error saving profile text: ", error);
    }
})

app.post('/save-source', async (req, res) => {

    try {
        const {userId, sourceNameLink, sourceLink, sourceNameText, sourceNameTextAuthor, profileData} = req.body;

         // Query to get the current tree
         const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const addSources = await pool.query(`
            INSERT INTO sources (tree_id, ancestor_id, source_link_name, source_link, source_text_name, source_text_author)
            VALUES ($1, $2, $3, $4, $5, $6)
            `, [
            currentTree,
            profileData.ancestor_id,
            sourceNameLink,   
            sourceLink,       
            sourceNameText,
            sourceNameTextAuthor
        ]);

    } catch (error) {
        console.log("Error saving source link:", error)
    }
})

app.post('/get-sources', async (req, res) => {
    try {

        const {userId, profileData} = req.body;
         // Query to get the current tree
         const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const getSources = await pool.query(`
            SELECT * FROM sources
            WHERE tree_id = ${currentTree} and ancestor_id = ${profileData.ancestor_id}
        `)

        const source_link_name = getSources.rows.map(row => row.source_link_name);
        const source_link = getSources.rows.map(row => row.source_link);
        const source_text_name = getSources.rows.map(row => row.source_text_name);
        const source_text_author = getSources.rows.map(row => row.source_text_author);

        const source_link_name_filtered = source_link_name.filter((i) => i !== null)
        const source_link_filtered = source_link.filter((i) => i !== null)
        const source_text_name_filtered = source_text_name.filter((i) => i !== null)
        const source_text_author_filtered = source_text_author.filter((i) => i !== null)

        res.json({
            source_link_name: source_link_name_filtered,
            source_link: source_link_filtered,
            source_text_name: source_text_name_filtered,
            source_text_author:source_text_author_filtered
        })

    } catch (error) {
        console.log("error getting sources:", error)
    }
})

app.post('/get-most-removed-ancestor', async (req, res) => {
    try {
        const {userId} = req.body;

         // Query to get the current tree
         const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;



        const getMostRemoved = await pool.query(`
            SELECT MAX(value) AS max_relation
            FROM (
                SELECT UNNEST(relation_to_user) AS value
                FROM tree_${currentTree}
            ) AS unnested_values;
        `)

        const findAncestor = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ${getMostRemoved.rows[0].max_relation} = ANY(relation_to_user)
        `)

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
            sex:findAncestor.rows[0].sex
        })

    } catch (error) {
        console.log("Error getting most removed ancestor: " , error)
    }
})

app.post('/save-progress', async (req, res) => {
    try {

        const {userId, progressNote, details} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
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
        console.log("Error saving progress:", error)
    }
})

app.post('/get-progress', async (req, res) => {
    try {

        const {userId} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const getProgress = await pool.query(`
            SELECT * FROM trees
            WHERE tree_id = ${currentTree}
        `)

        const getPerson = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${getProgress.rows[0].progress_id}
        `)

        if (getProgress.rows[0].progress_id) {
            res.json({
                name: `${getPerson.rows[0].first_name} ${getPerson.rows[0].middle_name} ${getPerson.rows[0].last_name}`,
                link: `profile/${getProgress.rows[0].progress_id}`,
                note:getProgress.rows[0].progress_note,
                bool: true
            })
        } else {
            res.json({
                bool:false
            })
        }

        


    } catch (error) {
        console.log("Error saving progress:", error)
    }
})

app.post('/remove-progress-note', async (req, res) => {
    try {

        const {userId} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const getProgress = await pool.query(`
            UPDATE trees
            SET 
                progress_id = null,
                progress_note = null
            WHERE tree_id = ${currentTree}
        `)
    

    } catch (error) {
        console.log("Error saving progress:", error)
    }
})

app.post('/find-page-number', async (req, res) => {
    try {

        const {userId, id} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const getNum = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${id}
        `)

        const pageNum = getNum.rows[0].page_number;
        res.json(pageNum);


    } catch(error) {
        console.log("error getting page number:", error)
    }
})

app.post('/search-ancestors', async (req, res) => {
    try {

        const {userId, firstName, middleName, lastName, birthDate, birthPlace, deathDate, deathPlace, ethnicity, profileNum} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const results = await pool.query(`
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
                `, [
            firstName, 
            middleName,
            lastName,
            birthDate, 
            birthPlace ? `%${birthPlace}%` : null, 
            deathDate, 
            deathPlace ? `%${deathPlace}%` : null,
            ethnicity, 
            profileNum
            ])

        const resultsArray = results.rows;

        res.json(resultsArray);

    } catch(error) {
        console.log("error searching ancestors:", error)
    }
})

app.post('/save-repeat-ancestor', async (req, res) => {
 
    try {

        const { userId, childDetails, repeatAncestorId} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        //adds repeat ancestor's id to his/her child's father/mother_id
        const findSex = await pool.query(`
            SELECT * FROM tree_${currentTree}
            WHERE ancestor_id = ${repeatAncestorId}
        `)

        const sex = findSex.rows[0].sex;

        if (sex === "male") {
            const addParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET father_id = ${repeatAncestorId}
                WHERE ancestor_id = ${childDetails.id}
            `)
        } else {
            const addParent = await pool.query(`
                UPDATE tree_${currentTree}
                SET mother_id = ${repeatAncestorId}
                WHERE ancestor_id = ${childDetails.id}
            `)
        }


        const recursivelyUpdateRelation = async (child, repeatParentId, sex) => {

            let childId = "";
            if (child.id) {
                childId = child.id;
            } else {
                childId = child.ancestor_id;
            }

            //finds child
            const getPerson = await pool.query(`SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${childId}`)
            const person = getPerson.rows[0];
            //finds parents
            const getFather = await pool.query(`SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${person.father_id}`)
            const father = getFather.rows[0];
            const getMother = await pool.query(`SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${person.mother_id}`)
            const mother = getMother.rows[0];
            //finds grandparents
            let pgrandfather = "";
            let pgrandmother = "";
            let mgrandfather = "";
            let mgrandmother = "";
            if (father) {
                const getpgrandfather = await pool.query(`SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${father.father_id}`)
                pgrandfather = getpgrandfather.rows[0];
                const getpgrandmother = await pool.query(`SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${father.mother_id}`)
                pgrandmother = getpgrandmother.rows[0];
            }
            if (mother) {
                const getmgrandfather = await pool.query(`SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${mother.father_id}`)
                mgrandfather = getmgrandfather.rows[0];
                const getmgrandmother = await pool.query(`SELECT * FROM tree_${currentTree} WHERE ancestor_id = ${mother.mother_id}`)
                mgrandmother = getmgrandmother.rows[0];
            }
            
            
            let newRelationNum = [];
            //if the function is being called for the first time, and not in any subsequent recursive call
            if(childId === childDetails.id) {

                //increments the items child's ID relation_to_user by one
                for (let i = 0; i < person.relation_to_user.length; i++) {
                    newRelationNum.push(person.relation_to_user[i] + 1);
                }

                //finds the current value of the repeat ancestor's relation_to_user
                const currentValue = await pool.query(`
                    SELECT * FROM tree_${currentTree}
                    WHERE ancestor_id = ${repeatParentId}
                `)

                const currentRelationToUser = currentValue.rows[0].relation_to_user;

                //appends the new relation_to_user to the old ones
                for (let i = 0; i < currentRelationToUser.length; i++) {
                    newRelationNum.push(currentRelationToUser[i]);
                }

                 //this new array is then added to the repeat ancestor's relation_to_user column
                const addNewRelationNum = await pool.query(`
                    UPDATE tree_${currentTree}
                    SET relation_to_user = $1
                    WHERE ancestor_id = $2
                `, [newRelationNum, repeatParentId])

            } else {
                //determine if user descends from more than one of repeat ancestor's children
                if (sex === "male") {
                    const findOtherChildren = await pool.query(`
                        SELECT * FROM tree_${currentTree}
                        WHERE father_id = ${repeatParentId}
                    `)

                    //find relation of all children, increment all by one and add to repeat ancestor's relation
                    let repeatAncestorRelationArray = [];
                    for (let i = 0; i < findOtherChildren.rows.length; i++) {
                        for (let j = 0; j < findOtherChildren.rows[i].relation_to_user.length; j++) {
                            repeatAncestorRelationArray.push(findOtherChildren.rows[i].relation_to_user[j] + 1)
                        }
                    }

                    //this new array is then added to the repeat ancestor's relation_to_user column
                    const addNewRelationNum = await pool.query(`
                        UPDATE tree_${currentTree}
                        SET relation_to_user = $1
                        WHERE ancestor_id = $2
                    `, [repeatAncestorRelationArray, repeatParentId])
            

                } else {
                    const findOtherChildren = await pool.query(`
                        SELECT * FROM tree_${currentTree}
                        WHERE mother_id = ${repeatParentId}
                    `)

                    //find relation of all children, increment all by one and add to repeat ancestor's relation
                    let repeatAncestorRelationArray = [];
                    for (let i = 0; i < findOtherChildren.rows.length; i++) {
                        for (let j = 0; j < findOtherChildren.rows[i].relation_to_user.length; j++) {
                            repeatAncestorRelationArray.push(findOtherChildren.rows[i].relation_to_user[j] + 1)
                        }
                    }

                    //this new array is then added to the repeat ancestor's relation_to_user column
                    const addNewRelationNum = await pool.query(`
                        UPDATE tree_${currentTree}
                        SET relation_to_user = $1
                        WHERE ancestor_id = $2
                    `, [repeatAncestorRelationArray, repeatParentId])
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
        }

        recursivelyUpdateRelation(childDetails, repeatAncestorId, sex);
        
        

    } catch (error) {
        console.log("Error saving repeat ancestor:", error)
    }
})

app.post('/save-profile-info', async (req, res) => {

    try {

        const { userId, profileData} = req.body;

        // Query to get the current tree
        const getCurrentTreeId = await pool.query(
            'SELECT current_tree_id FROM users WHERE id = $1',
            [userId]
        );

        const currentTree = getCurrentTreeId.rows[0].current_tree_id;

        const updateProfile = await pool.query(`
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
                maternal_haplogroup = $13
            WHERE ancestor_id = $14
        `, [
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
            profileData.ancestor_id

        ])


    } catch (error) {
        console.log("error saving profile info:", error)
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})