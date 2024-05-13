const { db } = require('./index');

const userExists = (req, res, next) => {
    const {username, email } = req.body;
    db.query('SELECT COUNT(1) FROM users WHERE username = $1 OR email = $2', [username, email], (error, results) => {
        if (results.rows[0].count == 0) {
            next();
        } else {
            res.status(400).send("Username or Email already exists")
        }
    })
};

module.exports = {
    userExists
}