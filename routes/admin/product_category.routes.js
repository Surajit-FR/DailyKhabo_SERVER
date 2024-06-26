const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const ModelAuth = require('../../middleware/auth/model_auth');
const { ImageUpload } = require('../../helpers/media_config');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const CategoryController = require('../../controller/admin/category.controller');
const ProductController = require('../../controller/admin/product.controller');
const ValidateCategory = require('../../model/validator/category.validate');
const ValidateProduct = require('../../model/validator/product.validate');

/**************************************************** CATEGORY ROUTES ****************************************************/
// Add new category
router.post('/add/new/category', [
    RequestRate.Limiter,
    ImageUpload.single('categoryImage'),
    ModelAuth(ValidateCategory),
    VerifyToken,
    Authorize(["all", "write_create"])
], CategoryController.CreateCategory);

// Get all category
router.get('/get/all/category', [
    VerifyToken,
    Authorize(["all", "read"])
], CategoryController.GetAllCategory);

// Update category
router.post('/update/category/:category_id', [
    RequestRate.Limiter,
    ImageUpload.single('categoryImage'),
    ModelAuth(ValidateCategory),
    VerifyToken,
    Authorize(["all", "delete"])
], CategoryController.UpdateCategory);

// Delete category
router.delete('/delete/category/:category_id', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["all", "delete"])
], CategoryController.DeleteCategory);

/**************************************************** PRODUCT ROUTES ****************************************************/
// Add new product
router.post('/add/new/product', [
    RequestRate.Limiter,
    ImageUpload.array('productImages'),
    ModelAuth(ValidateProduct),
    VerifyToken,
    Authorize(["all", "write_create"])
], ProductController.CreateProduct);

// Get all product
router.get('/get/all/product', [
    VerifyToken,
    Authorize(["all", "read"])
], ProductController.GetAllProduct);

// Get product details
router.get('/get/product/details/:product_id', [
    VerifyToken,
    Authorize(["all", "read"])
], ProductController.GetProductDetails);

// Update product
router.post('/update/product/:product_id', [
    RequestRate.Limiter,
    ImageUpload.array('productImages'),
    ModelAuth(ValidateProduct),
    VerifyToken,
    Authorize(["all", "edit_update"])
], ProductController.UpdateProduct);

// Delete product
router.delete('/delete/product/:product_id', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["all", "delete"])
], ProductController.DeleteProduct);


module.exports = router;