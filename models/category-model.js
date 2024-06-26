const mongob = require('mongodb');

const db = require('../database/database');

class Category {
    constructor(category) {
        this.name = category.name;
        this.text = category.text;
        if (category._id) {
            this.id = category._id.toString();
        };
    };

    static async getAllCategories() {
        const categories = await db.getDb().collection('categories').find().toArray();

        return categories.map(category => {
            return new Category(category);
        });
    };

    static async findCategoryById(id) {
        let category;
        try {
            const objId = new mongob.ObjectId(id);
            category = await db.getDb().collection('categories').findOne({_id: objId});
        } catch (error) {
            throw new Error(error);
        };

        return new Category(category);
    }

    async createAndUpdate() {
        const newCategory = {
            name: this.name,
            text: this.text,
        };

        if (this.id) {
            const objId = new mongob.ObjectId(this.id);
            await db.getDb().collection('categories').updateOne({_id: objId}, {$set: newCategory});
        } else {
            await db.getDb().collection('categories').insertOne(newCategory);
        };
    };

    async remove() {
        const objId = new mongob.ObjectId(this.id);
        await db.getDb().collection('categories').deleteOne({_id: objId});
    };
};

module.exports = Category;