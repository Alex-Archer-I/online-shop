const Product = require('../models/product-model');

const cartPage = (req, res) => {
    res.render('customer/cart/cart');
};

const addCartItem = async (req, res, next) => {
    let product;

    try {
        product = await Product.findById(req.body.id);
    } catch (error) {
        next(error);
        return;
    };

    res.locals.cart.addItem(product);
    req.session.cart = res.locals.cart;

    res.status(201).json({
        message: 'Cart updated!',
        cartData: res.locals.cart,
    });
};

const updateCartItem = (req, res) => {
    const updatedItemData = res.locals.cart.updateItem(req.body.id, +req.body.amount);

    req.session.cart = res.locals.cart;

    res.json({
        message: 'Cart updated!',
        cartData: res.locals.cart,
        updatedItemPrice: updatedItemData.updatedItemPrice,
    });
};

const getCartInfo = (req, res) => {
    res.json(res.locals.cart);
};

module.exports = {
    cartPage: cartPage,
    addCartItem: addCartItem,
    updateCartItem: updateCartItem,
    getCartInfo: getCartInfo,
};