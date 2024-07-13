// Import DB and Auth functions
const { db } = require('./index');
const auth = require('./authenticate')

// Middleware to check if a user with same username or email exists.
const userExists = async (req, res, next) => {
    const {username, email } = req.body;
    try {
        const results = await db.query('SELECT EXISTS(SELECT id FROM users WHERE username = $1 OR email = $2)', [username, email])
        if (!results.rows[0].exists) {
            next();
        } else {
            res.status(400).json({msg: "Username or Email already exists"})
        }     
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error occurred."})
    }
};

// POST request. User registration. Takes parameters, username, password, firstname, lastname and email.
// It hashes the password with the password hash function imported from auth with specified salt rounds
// Then makes a database query to insert into users database.
const registerUser = async (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;
    const hashedPassword = await auth.passwordHash(password, 10)
    const values = [username, hashedPassword, firstName, lastName, email];
    const text = "INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    try {
        const results = await db.query(text, values);
        res.status(201).json(results.rows[0]);    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error occurred."}) 
    }
}

// User id parameter middleware. Takes the id parameter from request and checks if a user exists.
// If user exists, assigns the id to req.userId and continues.
const userIdParam = async (req, res, next, id) => {
    console.log(id)
    try {
        const results = await db.query('SELECT EXISTS (SELECT id FROM users WHERE id = $1)', [id])
        if (results.rows[0].exists) {
            req.userId = id;
            next();
        }
        else {
            res.status(404).json({msg: "User not found"})
        }
    } catch (error) {
        res.status(400).json({msg: "Invalid ID"});
    }
}

// GET request. Gets user information for user with id matching req.userId
const getUserById = async (req, res) => {
    try {
        const results = await db.query('SELECT username, first_name, last_name, email, birth_date FROM users WHERE id = $1', [req.userId]);
        if (results.rows.length > 0) {
            res.status(200).json(results.rows[0]);
        } else {
            res.status(404).json({msg: "Page not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error occurred."}) 
    }
}

// PUT request. Updates personal information for a user matching the req.userId
const updateUser = async (req, res) => {
    const { first_name, last_name, email, birth_date } = req.body;
    const text = 'UPDATE users SET first_name = $1, last_name = $2, email = $3, birth_date = $4 WHERE id = $5';
    const parameters = [first_name, last_name, email, birth_date, req.userId];
    
    try {
        await db.query(text, parameters)
        res.redirect(`/${req.userId}`)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error occurred. Failed to update"}) 
    }
}

// DELETE request. Deletes user with id matching req.userId
const deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = $1', [req.userId]);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error occurred. Failed to delete"}) 
    }
}

// PUT request. Updates a user's password, hashes the new passwords and updates database.
const changePassword = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await auth.passwordHash(password, 10);
    const text = 'UPDATE users\
        SET password = $1\
        WHERE username = $2';
    
    try {
        await db.query(text, [hashedPassword, username])
        res.status(200).json({msg: "Password Changed!"})    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error occurred. Failed to update password"}) 
    }
}

// Export middleware functions.
module.exports = {
    userExists,
    userIdParam,
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
    changePassword
}
