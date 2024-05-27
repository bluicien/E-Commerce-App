const cartRouter = require('express').Router();

const auth = require('../db/authenticate');
const cartDb = require('../db/cartQuery');

cartRouter.get('/', auth.isAuthenticated, cartDb.getCart);
cartRouter.post('/checkout', auth.isAuthenticated, cartDb.checkoutCart)

module.exports = cartRouter;