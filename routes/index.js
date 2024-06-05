const express = require('express');
const apiRouter = express.Router();
const auth = require('../db/authenticate');

// Import routes
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');

// Use routes
apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/cart', auth.isAuthenticated, cartRouter);
apiRouter.use('/orders', auth.isAuthenticated, orderRouter);

// Export base route
module.exports = apiRouter;