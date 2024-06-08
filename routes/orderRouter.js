const orderRouter = require('express').Router();
const ordersDb = require('../db/orderQuery')


orderRouter.get('/', ordersDb.getOrders)

orderRouter.param('orderId', ordersDb.orderIdParam)
orderRouter.get('/:orderId', ordersDb.getOrdersById)


module.exports = orderRouter;