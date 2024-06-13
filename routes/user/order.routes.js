
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


module.exports = router;