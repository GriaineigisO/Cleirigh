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
            relation_to_user INT,
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
       

        const allPlacesJoined = filteredNoDuplicatedArray.join(", ")

        res.json({
            numOfPlaces: filteredNoDuplicatedArray.length,
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
        
        const occupationJoined = filteredNoDuplicatedArray.join(", ")


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
            sex:baseUserquery.rows[0].sex_id
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

        //finds what the current highest page number is, and increments it by on
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

        //finds sex of person
        // const sex = await pool.query (
        //     `
        //     SELECT sex FROM tree_${currentTree}
        //     WHERE ancestor_id = ${personID}
        //     `
        // )

        // let goDown = "";
        // if (sex.rows[0].sex === "male") {
        //     goDown = await pool.query(`
        //         SELECT * FROM tree_${currentTree}
        //         WHERE father_id = ${personID};
        //         `)
        // } else {
        //     goDown = await pool.query(`
        //         SELECT * FROM tree_${currentTree}
        //         WHERE mother_id = ${personID};
        //         `)
        // }

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

        const ancestorRelation = Number(relationToUserQuery.rows.map(row => row.relation_to_user)) + 1;

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
                relation_to_user
            )  
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
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
            ancestorRelation
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

        const ancestoridQuery = await pool.query(`
            SELECT ancestor_id FROM tree_${currentTree}
        `)  


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
                occupation = $10
             WHERE ancestor_id = $11`,
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
                personDetails.id,
            ]
        );
        

    } catch (error) {
        console.log("Error saving ancestor:", error)
    }
})

// app.post('/delete-person', async (req, res) => {
//     // try {

//     // const { userId, ancestorDetails, childID, sex} = req.body;

//     //     // Query to get the current tree
//     //     const getCurrentTreeId = await pool.query(
//     //         'SELECT current_tree_id FROM users WHERE id = $1',
//     //         [userId]
//     //     );

//     //     const currentTree = getCurrentTreeId.rows[0].current_tree_id;

//     //     const ancestoridQuery = await pool.query(`
//     //         SELECT ancestor_id FROM tree_${currentTree}
//     //     `)

//     //     const allAncestorIds = ancestoridQuery.rows.map(row => row.ancestor_id);

//     //     let ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
//     //     while (allAncestorIds.includes( ancestor_id)) {
//     //         ancestor_id = Math.floor(Math.random() * (999999 - 100000) + 100000);
//     //     }
        
//     //     if (sex === "male") {
//     //         const childQuery = await pool.query(`
//     //             UPDATE tree_${currentTree}
//     //             SET father_id = ${ancestor_id }
//     //             WHERE ancestor_id = ${childID}
//     //             `)
//     //     } else if (sex === "female") {
//     //         const childQuery = await pool.query(`
//     //             UPDATE tree_${currentTree}
//     //             SET mother_id = ${ancestor_id }
//     //             WHERE ancestor_id = ${childID}
//     //             `)
//     //     }      

//     //     //father of bottom page person has same page number
//     //     const pageNumQuery = await pool.query(`
//     //         SELECT * FROM tree_${currentTree}
//     //         WHERE ancestor_id = ${childID}
//     //     `)
//     //     const page_number = Number(pageNumQuery.rows.map(row => row.page_number));

//     //     const relationToUserQuery = await pool.query(`
//     //        SELECT * FROM tree_${currentTree}
//     //         WHERE ancestor_id = ${childID}
//     //         `)

//     //     const ancestorRelation = Number(relationToUserQuery.rows.map(row => row.relation_to_user)) + 1;

//     //     const ancestorQuery = await pool.query(`
//     //         INSERT INTO tree_${currentTree} (
//     //             first_name,
//     //             middle_name,
//     //             last_name,
//     //             ancestor_id,
//     //             page_number,
//     //             base_person,
//     //             sex,
//     //             ethnicity,
//     //             date_of_birth,
//     //             place_of_birth,
//     //             date_of_death,
//     //             place_of_death,
//     //             cause_of_death,
//     //             occupation,
//     //             relation_to_user
//     //         )  
//     //         VALUES (
//     //             $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
//     //         ) 
//     //     `, [
//     //         ancestorDetails.firstName,
//     //         ancestorDetails.middleName,
//     //         ancestorDetails.lastName,
//     //         ancestor_id,
//     //         page_number,
//     //         "false", 
//     //         sex,
//     //         ancestorDetails.ethnicity,
//     //         ancestorDetails.birthDate,
//     //         ancestorDetails.birthPlace,
//     //         ancestorDetails.deathDate,
//     //         ancestorDetails.deathPlace,
//     //         ancestorDetails.causeOfDeath,
//     //         ancestorDetails.occupation,
//     //         ancestorRelation
//     //     ]);

//     //     res.json(ancestor_id)
//     // } catch (error) {
//     //     console.log("Error saving ancestor:", error)
//     // }
// })

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})