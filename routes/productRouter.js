const express = require('express');
const productRouter = express.Router();

const { db } = require('../db/index')
const productDb = require('../db/productQuery')

productRouter.get('/', productDb.getProducts);
productRouter.post('/', productDb.postProduct)

productRouter.param('productId', productDb.productIdParam)

productRouter.get('/:productId', productDb.getProductById)
productRouter.put('/:productId', productDb.updateProduct)
productRouter.delete('/:productId', productDb.deleteProduct);

module.exports = productRouter;