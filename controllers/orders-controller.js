const Order = require('../models/order-model');
const User = require('../models/user-model');

const ordersPage = async (req, res, next) => {
    try {
        const orders = await Order.getOrdersByUser(res.locals.userId);

        res.render('customer/orders/all-orders', {orders: orders});
    } catch (error) {
        next(error);
    };
};

const newOrder = async (req, res, next) => {
    const cart = res.locals.cart;

    let user;
    try {
        user = await User.getUserById(res.locals.userId);
    } catch (error) {
        return next(error);
    };

    const order = new Order(cart, user);

    try {
        await order.save();
    } catch (error) {
        return next(error);
    };

    req.session.cart = null;

    res.redirect('/orders');
};

module.exports = {
    ordersPage: ordersPage,
    newOrder: newOrder,
};