const mongodb = require('mongodb');

const db = require('../database/database');

class Order {
    constructor(cart, userData, status = 'pending', date, id) {
        this.productsData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);

        if (this.date) {
            this.formattedDate = this.date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        };

        this.id = id;
    };

    static createOrderDocument(order) {
        return new Order(
            order.productData,
            order.userData,
            order.status,
            order.date,
            order._id
        );
    };

    static createOrderDocuments(orders) {
        return orders.map(this.createOrderDocument);
    };

    static async getAllOrders() {
        const orders = await db.getDb().collection('orders').find().sort({_id: -1}).toArray();

        return this.createOrderDocuments(orders);
    };

    static async getOrdersByUser(userId) {
        const uid = new mongodb.ObjectId(userId);

        const orders = await db.getDb().collection('orders').find({'userData._id': uid}).sort({_id: -1}).toArray();

        return this.createOrderDocuments(orders);
    };

    static async getOrderbyId(id) {
        const order = await db.getDb().collection('orders').findOne({_id: new mongodb.ObjectId(id)});

        return this.createOrderDocument(order);
    };

    save() {
        if (this.id) {
            const orderId = new mongodb.ObjectId(this.id);

            return db.getDb().collection('orders').updateOne({_id: orderId}, {$set: {status: this.status}});
        } else {
            const order = {
                userData: this.userData,
                productData: this.productsData,
                date: new Date(),
                status: this.status,
            };

            return db.getDb().collection('orders').insertOne(order);
        };
    };
};

module.exports = Order;