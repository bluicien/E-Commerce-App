const express = require('express');
const userRouter = express.Router();
const { db } = require('../db/index')
const userDb = require('../db/userQuery');

userRouter.post('/register', userDb.userExists, userDb.registerUser)

userRouter.param('userId', userDb.userIdParam)

userRouter.get('/:userId', userDb.getUserById);
userRouter.put('/:userId', userDb.updateUser);
userRouter.delete('/:userId', userDb.deleteUser);

module.exports = userRouter;