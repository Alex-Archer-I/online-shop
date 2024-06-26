const express = require('express');

const ordersController = require('../controllers/orders-controller');

const router = express.Router();

router.get('/', ordersController.ordersPage);

router.post('/', ordersController.newOrder);

module.exports = router;