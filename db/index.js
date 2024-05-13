const pg = require('pg');
const { Pool } = pg;
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_SECRET,
    port: process.env.DB_PORT
});

const query = (text, params, callback) => {
    console.log(process.env.DB_SECRET);
    console.log('Querying database...');
    return pool.query(text, params, callback);
}

module.exports.db = { query };