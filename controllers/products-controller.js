const Product = require('../models/product-model');
const Category = require('../models/category-model');

const allProductsPage = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        const categories = await Category.getAllCategories();

        const productsInfo = {};

        for (const category of categories) {
            productsInfo[`${category.name}`] = [];
        };

        for (const product of products) {
            productsInfo[`${product.category}`].push(product);
        };

        console.log(productsInfo);

        res.render('customer/products/all-products', {productsInfo: productsInfo});
    } catch (error) {
        next(error);
        return;
    };
};

const singleProductPage = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('customer/products/product-detail', {product: product});
    } catch (error) {
        next(error);
    };
};

const categoryPage = async (req, res, next) => {
    console.log(req.params.category);

    try {
        const allCategories = await Category.getAllCategories();
        const productsInfo = {};
        let singleCategory;

        for (const category of allCategories) {
            productsInfo[`${category.name}`] = null;
            if (category.name === req.params.category) {
                singleCategory = category;
            };
        };

        res.render('customer/products/category', {category: singleCategory, productsInfo: productsInfo});
    } catch (error) {};
};

module.exports = {
    allProductsPage: allProductsPage,
    singleProductPage: singleProductPage,
    categoryPage: categoryPage,
};