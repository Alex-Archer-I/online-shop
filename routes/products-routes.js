const express = require('express');

const productsController = require('../controllers/products-controller');
const { route } = require('./initial-routes');

const router = express.Router();

router.get('/products', productsController.allProductsPage);

router.get('/products/:id', productsController.singleProductPage);

router.get('/products/categories/:category', productsController.categoryPage);

module.exports = router;