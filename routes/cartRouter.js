const cartRouter = require('express').Router();

const auth = require('../db/authenticate');
const cartDb = require('../db/cartQuery');

cartRouter.get('/', auth.isAuthenticated, cartDb.getCart);

module.exports = cartRouter;