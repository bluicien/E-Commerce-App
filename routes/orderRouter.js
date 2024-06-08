const orderRouter = require('express').Router();
const ordersDb = require('../db/orderQuery')
const auth = require('../db/authenticate')


orderRouter.get('/', ordersDb.getOrders)

orderRouter.param('orderId', ordersDb.orderIdParam)
orderRouter.get('/:orderId', auth.isAuthenticated, auth.isAuthorized, )


module.exports = orderRouter;