const express = require('express');

const adminController = require('../controllers/admin-controller');
const imageUploader = require('../middlewares/image-upload');

const router = express.Router();

router.get('/products', adminController.manageProductsPage);

router.get('/products/new', adminController.createProductPage);

router.post('/products', imageUploader, adminController.createProductAction);

router.get('/products/:id', adminController.updateProductPage);

router.post('/products/:id', imageUploader, adminController.updateProductAction);

router.delete('/products/:id', adminController.removeProductAction);

router.get('/orders', adminController.ordersPage);

router.patch('/orders/:id', adminController.updateOrderAction);

router.get('/categories', adminController.editCategoriesPage);

router.get('/categories/list', adminController.getCategoriesAction);

router.post('/categories', adminController.createCategoryAction);

router.patch('/categories', adminController.updateCategoryAction);

router.delete('/categories/:id', adminController.removeCategoryAction);

module.exports = router;