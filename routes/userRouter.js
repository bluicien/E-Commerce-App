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

userRouter.post('/changePassword', userDb.changePassword)

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