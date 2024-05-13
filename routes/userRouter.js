const express = require('express');
const userRouter = express.Router();
const { db } = require('../db/index')
const { userExists } = require('../db/verification');

userRouter.get('/:userId', (req, res) => {
    const id = parseInt(req.params.userId);

    db.query('SELECT * FROM users WHERE id = $1', [id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    });
});

userRouter.post('/register', userExists, (req, res) => {
    const { username, password, first_name, last_name, email } = req.body;
    const values = [username, password, first_name, last_name, email];
    const text = "INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    db.query(text, values, (error, results) => {
        if (error) {
            res.status(400).send("Bad Request");
        }
        res.status(201).json(results.rows[0]);
    });
    
})


userRouter.put('/:userId', (req, res) => {
    const id = parseInt(req.params.userId);
    const { password, first_name, last_name, email, birth_date } = req.body;
    const text = 'UPDATE users SET password = $1, first_name = $2, last_name = $3, email = $4, birth_date = $5 WHERE id = $6';
    const parameters = [password, first_name, last_name, email, birth_date, id];
    
    db.query(text, parameters, (error, results) => {
        if (error) {
            throw error;
        } 
        res.status(200).send(results.rows);
    })    
});

userRouter.delete('/:userId', (req, res) => {
    const id = parseInt(req.params.userId);
    const text = 'DELETE FROM users WHERE id = $1';

    db.query(text, [id], (error, results) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send("User Deleted.");
    });
});

module.exports = userRouter;