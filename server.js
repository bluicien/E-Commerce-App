const { db } = require('./db/index')
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();
// const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', async (req, res) => {
    const result = await db.query('SELECT * FROM users');
    res.status(200).json(result.rows[0]);
});

app.get('/users/:userId', async (req, res) => {
    const id = parseInt(req.params.userId);

    await db.query('SELECT * FROM users WHERE id = $1', [id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    });
});

app.post('/users', async (req, res) => {
    const { username, password, first_name, last_name,email } = req.body;
    const values = [username, password, first_name, last_name, email];
    const text = "INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    await db.query(text, values, (error, result) => {
        if (error) {
            throw error;
        }
        res.status(201).json(result.rows[0]);
    })
})


app.put('/users/:userId', async (req, res) => {
    const id = parseInt(req.params.userId);
    const { password, first_name, last_name, email, birth_date } = req.body;
    const text = 'UPDATE users SET password = $1, first_name = $2, last_name = $3, email = $4, birth_date = $5 WHERE id = $6';
    const parameters = [password, first_name, last_name, email, birth_date, id];
    
    await db.query(text, parameters, (error, results) => {
        if (error) {
            throw error;
        } 
        res.status(200).send(results.rows);
    })    
});

app.delete('/users/:userId', async (req, res) => {
    const id = parseInt(req.params.userId);
    const text = 'DELETE FROM users WHERE id = $1';

    await db.query(text, [id], (error, results) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send("User Deleted.");
    });
});

app.get('/products', async (req, res) => {
    const result = await db.query('SELECT * FROM products LIMIT 5', (error, result) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).json(result.rows);
    });
});

app.get('/products/:productId', async (req, res) => {
    const id = parseInt(req.params.productId);

    await db.query('SELECT * FROM products WHERE id = $1', [id], (error, result) => {
        if (error) {
            res.status(400).send("Bad Request");
        } else {
            res.status(200).json(result.rows);
        }
    });
})

app.listen(process.env.PORT, () => {
    console.log(`E-Commerce App is listening on PORT ${process.env.PORT} `);
});
