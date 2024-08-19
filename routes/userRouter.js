// Import express and create user route with express-router
const express = require('express');
const userRouter = express.Router();

// Import database and authentication functions
const userDb = require('../db/userQuery');
const auth = require('../db/authenticate');

// Import passport.js
const passport = require('passport');


// Get login page (Unnecessary)
// userRouter.get('/login', (req, res) => {
//     res.json({msg: "Login page here"})
// })

// Login user with passport.js local authentication
userRouter.post('/login',
    passport.authenticate("local", {
        failureRedirect: "/users/login"
    }),
    (req, res) => {
        const { user : { username } } = req;
        console.log(username + "Successfully logged in ")
        res.status(200).json({username: username})
        return;
    }
)

// Register a normal new user
userRouter.post('/register', userDb.userExists, userDb.registerUser);

// Register a new organization
userRouter.post('/registerOrganization', userDb.userExists, userDb.registerOrganization);

// Change password endpoint
userRouter.post('/changePassword', userDb.changePassword)

// User logout endpoint
userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    res.status(200).json({ msg: "User logged out" });
})

// User parameter middleware
userRouter.param('userId', userDb.userIdParam)

// Get user by ID
userRouter.get('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.getUserById);

// Update user information
userRouter.put('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.updateUser);

// Delete user
userRouter.delete('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.deleteUser);

// Export user router
module.exports = userRouter;