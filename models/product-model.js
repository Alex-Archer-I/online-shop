const mongodb = require('mongodb');

const db = require('../database/database');

class Product {
    constructor(product) {
        this.title = product.title;
        this.summary = product.summary;
        this.price = +product.price;
        this.description = product.description;
        this.category = product.category;
        this.img = product.img;
        this.createImgData();
        if (product._id) {
            this.id = product._id.toString();
        };
    };

    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();

        return products.map(product => {
            return new Product(product);
        });
    };

    static async findById(id) {
        let idObj;
        try {
            idObj = new mongodb.ObjectId(id);
        } catch (error) {
            error.code = 404;
            error.orange = 'Orange!!!';
            throw error;
        };

        const product = await db.getDb().collection('products').findOne({_id: idObj});

        if (!product) {
            const error = new Error('Could not find this id');
            error.code = 404;
            throw error;
        };
        return new Product(product);
    };

    static async findMultiple(ids) {
        const idsObj = ids.map(id => {
            return new mongodb.ObjectId(id);
        });

        const products = await db.getDb().collection('products').find({_id : {$in: idsObj}}).toArray();

        return products.map(product => {return new Product(product)});
    };

    createImgData() {
        this.imgPath = `product-data/images/${this.img}`;
        this.imgUrl = `/products/assets/images/${this.img}`;
    };

    async create() {
        const newProduct = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            category: this.category,
            img: this.img,
        };

        if (this.id) {
            const idObj = new mongodb.ObjectId(this.id);

            if (!this.img) {
                delete newProduct.img;
            };

            await db.getDb().collection('products').updateOne({_id: idObj}, {$set: newProduct});
        } else {
            await db.getDb().collection('products').insertOne(newProduct);
        };
    };

    updateImage(newImage) {
        this.img = newImage;
        this.createImgData();
    };

    remove() {
        const idObj = new mongodb.ObjectId(this.id);
        return db.getDb().collection('products').deleteOne({_id: idObj});
    };
};

module.exports = Product;