const express = require('express');

const cartController = require('../controllers/cart-controller');

const router = express.Router();

router.get('/', cartController.cartPage);

router.post('/items', cartController.addCartItem);

router.patch('/items', cartController.updateCartItem);

router.get('/info', cartController.getCartInfo);

module.exports = router;