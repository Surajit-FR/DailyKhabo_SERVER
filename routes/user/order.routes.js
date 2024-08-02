
const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const OrderController = require('../../controller/user/order.controller');
const { VerifyToken } = require('../../middleware/auth/auth_user');
const ModelAuth = require('../../middleware/auth/model_auth');
const ValidateOrder = require('../../model/validator/order.validate');


// Take order
router.post('/take/order', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateOrder),
], OrderController.TakeOrder);

// Get all order
router.get('/get/all/orders', [
    VerifyToken,
], OrderController.GetAllOrder);

// Order delivered
router.post('/order/delivered/:orderId', [
    VerifyToken,
], OrderController.OrderDelivered);


module.exports = router;