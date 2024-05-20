const { db } = require('./index');
const auth = require('./authenticate')

const userExists = (req, res, next) => {
    const {username, email } = req.body;
    db.query('SELECT EXISTS(SELECT id FROM users WHERE username = $1 OR email = $2)', [username, email], (error, results) => {
        if (!results.rows[0].exists) {
            next();
        } else {
            res.status(400).send("Username or Email already exists")
        }
    })
};

const registerUser = async (req, res) => {
    const { username, password, first_name, last_name, email } = req.body;
    const hashedPassword = await auth.passwordHash(password, 10)
    const values = [username, hashedPassword, first_name, last_name, email];
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
        if (error) {
            res.status(400).json({msg: "Invalid ID"});
        }
        if (results.rows[0].exists) {
        req.userId = id;
            next();
        }
        else {
            res.status(404).send("User not found")
        }            
    })
}

const getUserById = (req, res) => {
    db.query('SELECT * FROM users WHERE id = $1', [req.userId], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}

const updateUser = (req, res) => {
    const { password, first_name, last_name, email, birth_date } = req.body;
    const text = 'UPDATE users SET password = $1, first_name = $2, last_name = $3, email = $4, birth_date = $5 WHERE id = $6';
    const parameters = [password, first_name, last_name, email, birth_date, req.userId];
    
    db.query(text, parameters, (error, results) => {
        if (error) {
            throw error;
        } 
        res.status(200).send(results.rows);
    })    
}

const deleteUser = (req, res) => {
    const text = 'DELETE FROM users WHERE id = $1';

    db.query(text, [req.userId], (error, results) => {
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
