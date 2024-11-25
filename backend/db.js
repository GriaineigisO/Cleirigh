const { Pool } = require('pg');

const pool = new Pool({
    user: 'caledonian',
    host: 'localhost',
    database: 'cleirigh',
    password: 'bellBeaker2500',
    port: 5432,
});

module.exports ={
    query: (text, params) => pool.query(text, params)
}