const { db } = require('./index');
const bcrypt = require('bcrypt');

// Authenticate user
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login')
    }
}

// Authenticate and Authorize user
const isAuthorized = (req, res, next) => {
    const requestedUserId = req.params.userId;
    const currentUserId = req.user.id;
    if (requestedUserId == currentUserId) {
        return next();
    } else {
        console.log(requestedUserId)
        res.status(403).json({msg: "You are not authorized to view this page."})
    }
}

// Password hashing function
const passwordHash = async (password, saltRounds) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
    return null;
}

// Compare hash password in database with entered password
const comparePasswords = async (password, hash) => {
    try {
        const matchFound = await bcrypt.compare(password, hash);
        return matchFound;
    } catch (error) {
        console.log(error);
    }
    return false;
}

const findByUsername = async (username, cb) => {
    try {
        const results = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (results.rows[0].username === username) {
            return cb(null, results.rows[0]);
        }
        return cb(null, null);
    } catch (error) {
        return cb(new Error('An unexpected error has occurred'))
    }
}

const findById = async (id, cb) => {
    try {
        const results = await db.query('SELECT * FROM users WHERE id = $1', [id])
        if (results.rows.length > 0) {
            return cb(null, results.rows[0])
        } else {
            return cb(new Error(`User with ${id} does not exist`))
        }
    } catch (error) {
        return cb(new Error('An unexpected error has occurred'))
    }
}



module.exports = {
    isAuthenticated,
    isAuthorized,
    findByUsername,
    findById,
    passwordHash,
    comparePasswords
};

