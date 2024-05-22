const express = require('express');
const productRouter = express.Router();

const auth = require('../db/authenticate');
const productDb = require('../db/productQuery')

productRouter.get('/', productDb.getProducts);

productRouter.post('/', auth.isAuthenticated, productDb.postProduct)

productRouter.param('productId', productDb.productIdParam)

productRouter.get('/:productId', productDb.getProductById)
productRouter.put('/:productId', auth.isAuthenticated, productDb.updateProduct)
productRouter.delete('/:productId', auth.isAuthenticated, productDb.deleteProduct);
productRouter.put('/:productId/addtocart', auth.isAuthenticated, productDb.addToCart);

module.exports = productRouter;