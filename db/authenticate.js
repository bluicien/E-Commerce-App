const { db } = require('./index'); // Import DB query function
const bcrypt = require('bcrypt'); // Import bcrypt module

// Check if user is authenticated for the request made.
const isAuthenticated = (req, res, next) => {
    console.log("Authenticating...")
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({msg: "Unauthorized to view!"})
    }
}

// Check user authorization to ensure user cannot make requests to other users' pages.
const isAuthorized = (req, res, next) => {
    console.log("Checking user authorization...")
    const requestedUserId = req.params.userId;
    const currentUserId = req.user.id;
    if (requestedUserId == currentUserId) {
        return next();
    } else {
        console.log(requestedUserId)
        return res.status(403).json({msg: "You are not authorized to view this page."})
    }
}

// Password hashing function
const passwordHash = async (password, saltRounds) => {
    console.log("Hashing password...")
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
    console.log("Checking password...")
    try {
        const matchFound = await bcrypt.compare(password, hash);
        return matchFound;
    } catch (error) {
        console.log(error);
    }
    return false;
}

//  Find user user by username, this function is used in Passport.js
const findByUsername = async (username, cb) => {
    console.log("Finding user...")
    try {
        // Query users database to find match for username
        const results = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (results.rows.length > 0 && results.rows[0].username === username) {
            return cb(null, results.rows[0]);
        }
        return cb(null, null);
    } catch (error) {
        return cb(new Error('An unexpected error has occurred'))
    }
}

// Find user by user ID
const findById = async (id, cb) => {
    console.log("Finding user by id...")
    try {
        // Query users database by user ID
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


// Export user authentication functions
module.exports = {
    isAuthenticated,
    isAuthorized,
    findByUsername,
    findById,
    passwordHash,
    comparePasswords
};

