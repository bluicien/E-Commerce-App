const { db } = require('./index');

const userExists = (req, res, next) => {
    const {username, email } = req.body;
    db.query('SELECT EXISTS(SELECT id FROM users WHERE username = $1 OR email = $2)', [username, email], (error, results) => {
        console.log(results.rows[0].exists)
        if (!results.rows[0].exists) {
            next();
        } else {
            res.status(400).send("Username or Email already exists")
        }
    })
};

const registerUser = (req, res) => {
    const { username, password, first_name, last_name, email } = req.body;
    const values = [username, password, first_name, last_name, email];
    const text = "INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    db.query(text, values, (error, results) => {
        if (error) {
            res.status(400).send("Bad Request");
        }
        res.status(201).json(results.rows[0]);
    });
    
}

const userIdParam = (req, res, next, id) => {
    db.query('SELECT EXISTS (SELECT id FROM users WHERE id = $1)', [id], (error, results) => {
        if (results.rows[0].exists) {
            req.id = id;
            next();
        }
        else {
            res.status(404).send("User not found")
        }
    })
}

const getUserById = (req, res) => {
    db.query('SELECT * FROM users WHERE id = $1', [req.id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    });
}

const updateUser = (req, res) => {
    const { password, first_name, last_name, email, birth_date } = req.body;
    const text = 'UPDATE users SET password = $1, first_name = $2, last_name = $3, email = $4, birth_date = $5 WHERE id = $6';
    const parameters = [password, first_name, last_name, email, birth_date, req.id];
    
    db.query(text, parameters, (error, results) => {
        if (error) {
            throw error;
        } 
        res.status(200).send(results.rows);
    })    
}

const deleteUser = (req, res) => {
    const text = 'DELETE FROM users WHERE id = $1';

    db.query(text, [req.id], (error, results) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send("User Deleted.");
    });
}

module.exports = {
    userExists,
    userIdParam,
    registerUser,
    getUserById,
    updateUser,
    deleteUser
}
