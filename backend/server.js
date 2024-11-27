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

const app = express();
app.use(cors());
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


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected:', res.rows[0]);
    }
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
            name TEXT,
            ancestor_id INT PRIMARY KEY,
            page_number INT, 
            sex BOOLEAN, 
            ethnicity TEXT, 
            date_of_birth DATE, 
            place_of_birth TEXT, 
            date_of_death DATE, 
            place_of_death TEXT, 
            cause_of_death TEXT, 
            occupation TEXT, 
            father_id INT, 
            mother_id INT
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
            // User has trees, return true
            console.log("has trees")
            res.json({ hasTrees: true });
            } else {
            // User has no trees, return false
            console.log("no trees")
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

//check if the currently selected tree is empty
app.post('/check-if-tree-empty', async (req, res) => {
    try {
        const { currentTree } = req.body; 

        if (!currentTree || !currentTree.treeId) {
            return res.status(400).json({ error: 'No valid tree provided' });
        }
  console.log(currentTree.treeId)
        const treeTableName = `tree_${currentTree.treeId}`; // Dynamic table name

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


  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})