const orderRouter = require('express').Router();
const ordersDb = require('../db/orderQuery')


orderRouter.get('/', ordersDb.getOrders)
orderRouter.get('/:orderId')

module.exports = orderRouter;