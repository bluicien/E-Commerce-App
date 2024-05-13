const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');

apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);

module.exports = apiRouter;