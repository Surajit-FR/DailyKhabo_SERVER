const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const UtilityController = require('../../controller/admin/utility.controller');
const OrderController = require('../../controller/user/order.controller');
// const { trackIP } = require('../../helpers/ip_tracker');

/**************************************************** UTILITY ROUTES ****************************************************/

// Get most sold products
router.get('/get/most-sold/products', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["all", "read"])
], UtilityController.GetMostSoldProducts);

// Get all order
router.get('/get/all/orders', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["all", "read"])
], OrderController.GetAllOrder);

// Get all Customrs
router.get('/get/all/customers', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["all", "read"])
], UtilityController.GetAllCustomer);

// router.get('/ip-stats', [trackIP], (req, res) => {
//     res.json(req.ipCounts);
// });


module.exports = router;