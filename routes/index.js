const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');

apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/cart', cartRouter)

module.exports = apiRouter;