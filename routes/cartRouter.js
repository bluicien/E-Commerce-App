const cartRouter = require('express').Router();

const auth = require('../db/authenticate');
const cartDb = require('../db/cartQuery');

cartRouter.get('/', cartDb.getCart);
cartRouter.post('/checkout', cartDb.checkoutCart)

module.exports = cartRouter;