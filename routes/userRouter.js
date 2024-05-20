const express = require('express');
const userRouter = express.Router();

const userDb = require('../db/userQuery');
const auth = require('../db/authenticate');
const passport = require('passport');


userRouter.get('/login', (req, res) => {
    res.json({msg: "Login page here"})
})

userRouter.post('/login', 
    passport.authenticate("local", { failureRedirect: "/users/login"}),
    (req, res) => {
        res.status(200).send({msg: "Successfully logged in!"})
    }
)

userRouter.post('/register', userDb.userExists, userDb.registerUser)

userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    res.redirect('./login');
})

userRouter.param('userId', userDb.userIdParam)

userRouter.get('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.getUserById);
userRouter.put('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.updateUser);
userRouter.delete('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.deleteUser);

module.exports = userRouter;

////ALTERNATIVE METHOD
// const { username, password } = req.body;
// db.query('SELECT id, username, password, role_id FROM users WHERE username = $1', [username], (error, results) => {
//     const user = results.rows[0];
//     if (!user) {
//         res.status(404).json({msg: "User does not exist"});
//     } else if (user.password != password) {
//         res.status(400).json({msg: "Bad Credentials"});
//     } else if (user.username == username && user.password == password) {
//         req.session.authenticated = true;
//         req.session.user = {
//             userId: user.id,
//             username,
//             password
//         }
        
//         res.status(200).json({msg: "Successfully logged in!"})
//     }
// })