const Cart = require('../models/cart-model');

const createCart = (req, res, next) => {
    let cart;

    if (!req.session.cart) {
        cart = new Cart();
    } else {
        const currentCart = req.session.cart;
        cart = new Cart(currentCart.items, currentCart.totalQuantity, currentCart.totalPrice);
    };

    res.locals.cart = cart;

    next();
};

module.exports = createCart;