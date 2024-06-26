const Product = require('../models/product-model');
const Order = require('../models/order-model');
const Category = require('../models/category-model');

const manageProductsPage = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        const categories = await Category.getAllCategories();

        const productsInfo = {};
        productsInfo.noCategory = [];
        const categoriesNames = [];

        for (const category of categories) {
            productsInfo[`${category.name}`] = [];
            categoriesNames.push(category.name);
        };

        for (const product of products) {
            if (categoriesNames.includes(product.category)) {
                productsInfo[`${product.category}`].push(product);
            } else {
                productsInfo.noCategory.push(product);
            };
        };

        res.render('admin/products/all-products', {productsInfo: productsInfo});
    } catch (error) {
        next(error);
        return;
    };
};

const createProductPage = async (req, res) => {
    try {
        const categories = await Category.getAllCategories();
        res.render('admin/products/new-product', {categories: categories});
    } catch(error) {
        next(error);
        return;
    };
};

const createProductAction = async (req, res, next) => {

    const product = new Product({
        ...req.body,
        img: req.file.filename,
    });

    try {
        await product.create();
    } catch(error) {
        next(error);
        return;
    };

    res.redirect('/admin/products');
};

const updateProductPage = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.getAllCategories();
        res.render('admin/products/update-product', {product: product, categories: categories});
    } catch (error) {
        next(error);
    };
};

const updateProductAction = async (req, res, next) => {
    const product = new Product({
        ...req.body,
        _id: req.params.id,
    });

    if (req.file) {
        product.updateImage(req.file.fileane);
    };

    try {
        await product.create();
    } catch (error) {
        next(error);
        return;
    };

    res.redirect('/admin/products');
};

const removeProductAction = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        await product.remove();
    } catch (error) {
        next(error);
        return;
    };

    res.json({message: 'Yes'});
};

const ordersPage = async (req, res, next) => {
    try {
        const orders = await Order.getAllOrders();

        console.log(orders);

        res.render('admin/orders/all-orders', {orders: orders});
    } catch (error) {
        next(error);
    };
};

const updateOrderAction = async (req, res, next) => {
    const id = req.params.id;
    const newStatus = req.body.newStatus;

    try {
        const order = await Order.getOrderbyId(id);

        order.status = newStatus;

        order.save();

        res.json({
            message: 'Order successfuly updated!',
            status: newStatus,
        });
    } catch (error) {
        next(error);
    };
};

const editCategoriesPage = async (req, res, next) => {
    try {
        const allCategories = await Category.getAllCategories();
        
        res.render('admin/products/edit-categories', {categories: allCategories});
    } catch(error) {
        next(error);
        return;
    };
};

const getCategoriesAction = async (req, res, next) => {
    try {
        const allCategories = await Category.getAllCAtegories();
        res.json({categories: allCategories});
    } catch(error) {
        next(error);
        return;
    };
};

const createCategoryAction = async (req, res, next) => {
    const category = new Category({name: req.body.name, text: req.body.text});

    try {
        await category.createAndUpdate();
        const allCategories = await Category.getAllCategories();
        res.json({
            message: 'Categories updated!',
            categories: allCategories,
        });
    } catch(error) {
        next(error);
        return;
    };
};

const updateCategoryAction = async (req, res, next) => {
    console.log('Updating!');
    const category = new Category({
        name: req.body.name,
        text: req.body.text,
        _id: req.body.id,
    });

    try {
        await category.createAndUpdate();
        res.json({
            message: 'Categories updated!',
        });
    } catch (error) {
        next(error);
        return;
    };
};

const removeCategoryAction = async (req, res, next) => {
    try {
        const category = await Category.findCategoryById(req.params.id);
        category.remove();
    } catch (error) {
        next(error);
        return;
    };

    res.json({message: 'Yes'});
};

module.exports = {
    manageProductsPage: manageProductsPage,
    createProductPage: createProductPage,
    createProductAction: createProductAction,
    updateProductPage: updateProductPage,
    updateProductAction: updateProductAction,
    removeProductAction: removeProductAction,
    ordersPage: ordersPage,
    updateOrderAction: updateOrderAction,
    editCategoriesPage: editCategoriesPage,
    getCategoriesAction: getCategoriesAction,
    createCategoryAction: createCategoryAction,
    updateCategoryAction: updateCategoryAction,
    removeCategoryAction: removeCategoryAction,
};