const express = require('express');
const userRouter = express.Router();

const userDb = require('../db/userQuery');
const auth = require('../db/authenticate');
const passport = require('passport');


userRouter.get('/login', (req, res) => {
    res.json({msg: "Login page here"})
})

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

userRouter.post('/register', userDb.userExists, userDb.registerUser)

userRouter.post('/changePassword', userDb.changePassword)

userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    res.status(200).json({ msg: "User logged out" });
})

userRouter.param('userId', userDb.userIdParam)

userRouter.get('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.getUserById);
userRouter.put('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.updateUser);
userRouter.delete('/:userId', auth.isAuthenticated, auth.isAuthorized, userDb.deleteUser);

module.exports = userRouter;