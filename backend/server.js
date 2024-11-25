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

app.post('api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //Check if user already exists
        const userExists = await Pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.row.length > 0) {
            return res.status(400).json({ message: 'User already exists'});
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //insert new user into the database
        const newUser = await Pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        //generate token for user
        const token = jwt.sign({ id: newUser.rows[0].id }, 'jwt_secret', { expiresIn: '1h'});

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

app.post('api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        //find user by email
        const result = await Pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        //compare password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        };

        //respond with token and user data
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
        });
    } catch (err) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'server error' });
    };
});

//checks if user has a paid account or not
app.get('/api/user', async (req, res) => {
    const username = req.query.username;
    try {
        const result = await cleirighUserDB.query('SELECT premium FROM users WHERE username = $1', [username]);

        if (result.rows.legnth > 0) {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})