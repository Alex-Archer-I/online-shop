const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../database/database');

class User {
    constructor (email, password, name, address) {
        this.password = password;
        this.email = email;
        this.name = name;
        this.address = address;
    };

    static getUserById(id) {
        const uid = new mongodb.ObjectId(id);

        return db.getDb().collection('users').findOne({_id: uid}, {projection: {password: 0}});
    };

    getUserByEmail() {
        return db.getDb().collection('users').findOne({email: this.email});
    };

    async checkUserByEmail() {
        const user = await this.getUserByEmail();
        if (user) {
            return true;
        } else {
            return false;
        };
    };

    comparePasswords(password) {
        console.log('Hash: ' + password);
        return bcrypt.compare(this.password, password);
    };

    async singUp() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            name: this.name,
            email: this.email,
            address: this.address,
            password: hashedPassword,
        });
    };
};

module.exports = User;