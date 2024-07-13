// Import PostgreSQL package for querying database.
const pg = require('pg');
const { Pool } = pg;

// Import ENV variables.
require('dotenv').config();

// Config pool instance with ENV variables.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_SECRET,
    port: process.env.DB_PORT
});

// Query function with logging for single queries to database
const query = (text, params) => {
    console.log('Querying database...');
    return pool.query(text, params);
}

// Function to connect to database for multiple queries. 
const getClient = async () => {
    console.log("Connected to database...")
    return await pool.connect();
}

// Export DB query functions.
module.exports.db = { query, getClient };