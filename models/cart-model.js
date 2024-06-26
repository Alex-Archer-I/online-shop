const Product = require('./product-model');

class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    };

    async updatePrices() {
        const ids = this.items.map(item => {
            return item.product.id;
        });

        const products = await Product.findMultiple(ids);

        const productsToRemove = [];

        for (const item of this.items) {
            const product = products.find(prod => {
                return prod.id === item.product.id;
            });

            if (!product) {
                productsToRemove.push(item.product.id);
                continue;
            };

            item.product = product;
            item.totalPrice = item.quantity * item.product.price;
        };

        if (productsToRemove.length > 0) {
            this.items = this.items.filter(item => {
                return productsToRemove.indexOf(item.product.id) < 0;
            });
        };

        this.totalQuantity = 0;
        this.totalPrice = 0;

        for (const item of this.items) {
            this.totalQuantity = this.totalQuantity + item.quantity;
            this.totalPrice = this.totalPrice + item.totalPrice;
        };
    };

    addItem(item) {
        const newItem = {
            product: item,
            quantity: 1,
            totalPrice: item.price,
        };

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].product.id === item.id) {
                newItem.quantity = +this.items[i].quantity + 1;
                newItem.totalPrice = item.price * newItem.quantity;
                this.items[i] = newItem;

                this.totalQuantity++;
                this.totalPrice = this.totalPrice + item.price;

                return;
            };
        };

        this.items.push(newItem);
        this.totalQuantity++;
        this.totalPrice = this.totalPrice + item.price;
    };

    updateItem(id, amount) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].product.id === id && amount > 0) {
                const cartItem = {...this.items[i]};
                cartItem.quantity = amount;
                cartItem.totalPrice = cartItem.product.price * cartItem.quantity;

                this.totalQuantity = this.totalQuantity + (amount - this.items[i].quantity);
                this.totalPrice += this.items[i].product.price * (amount - this.items[i].quantity);
                this.items[i] = cartItem;

                return {
                    updatedItemPrice: cartItem.totalPrice,
                };
            } else if (this.items[i].product.id === id && amount <= 0) {
                const removedItems = this.items.splice(i, 1);

                this.totalQuantity = this.totalQuantity - removedItems[0].quantity;
                this.totalPrice -= removedItems[0].totalPrice;

                return {
                    updatedItemPrice: 0,
                };
            };
        };
    };
};

module.exports = Cart;