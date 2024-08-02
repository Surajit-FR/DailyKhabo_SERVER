
const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const OrderController = require('../../controller/user/order.controller');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');

// Get all order
router.get('/get/all/orders', [
    VerifyToken,
    Authorize(["all", "read"])
], OrderController.GetAllOrder);


module.exports = router;