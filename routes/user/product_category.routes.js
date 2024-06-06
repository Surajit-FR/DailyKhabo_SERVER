const express = require('express');
const router = express.Router();
// const RequestRate = require('../../helpers/request_limiter');
const CategoryController = require('../../controller/admin/category.controller');
const ProductController = require('../../controller/admin/product.controller');

/**************************************************** CATEGORY ROUTES ****************************************************/
// Get all category
router.get('/get/all/category', [
], CategoryController.GetAllCategory);

/**************************************************** PRODUCT ROUTES ****************************************************/
// Get all product
router.get('/get/all/product', [
], ProductController.GetAllProduct);

// Get product details
router.get('/get/product/details/:product_id', [
], ProductController.GetProductDetails);


module.exports = router;