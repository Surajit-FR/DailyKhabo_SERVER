const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const CartController = require('../../controller/user/cart.controller');
const { VerifyToken } = require('../../middleware/auth/auth_user');
const { CheckProductStock } = require('../../middleware/cart/check_product_stock');
const ModelAuth = require('../../middleware/auth/model_auth');
const ValidateCart = require('../../model/validator/cart.validate');


// Add cart
router.post('/add/cart', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateCart),
    CheckProductStock,
], CartController.AddCart);

// Increase & Decrease cart
router.post('/update/cart/item', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateCart),
    CheckProductStock,
], CartController.UpdateCartQuantity);

// Delete cart Item
router.delete('/delete/cart/item/:product_id', [
    RequestRate.Limiter,
    VerifyToken,
], CartController.DeleteCartItem);

// Get all cart data
router.get('/get/all/cart/data', [
    VerifyToken,
], CartController.GetAllCartData);


module.exports = router;