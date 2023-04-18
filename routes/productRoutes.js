const express = require('express')
const routerproduct = express.Router()
const productController = require('../controllers/productController')


routerproduct.route('/')
    .get(productController.getProducts)
    .post(productController.createNewProduct)
    .delete(productController.deleteProduct)


module.exports = routerproduct  