const { db } = require('./index');
const bcrypt = require('bcrypt');

// Authenticate user
const isAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.status(403).json({ msg: "You are not authorized to view this page"});
    }
}

// Authenticate and Authorize user
const isAuthorized = (req, res, next) => {
    if (req.session.authenticated && req.session.userId == req.userId) {
        next();
    } else {
        res.status(403).json({ msg: "You are not authorized to view this page"})
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

const findByUsername = (username, cb) => {
    db.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
        if (error) {
            res.status(400).json({msg: "Bad Request"})
        }
        if (results.rows[0].username === username) {
            return cb(null, results.rows[0]);
        }
        return cb(null, null);
    })
}

const findById = (id, cb) => {
    db.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (results.rows.length > 0) {
            return cb(null, results.rows[0])
        } else {
            return cb(new Error(`User with ${id} does not exist`))
        }
    })
}



module.exports = {
    isAuthenticated,
    isAuthorized,
    findByUsername,
    findById,
    passwordHash,
    comparePasswords
};

