
const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const CouponController = require('../../controller/admin/coupon.controller');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const ModelAuth = require('../../middleware/auth/model_auth');
const ValidateCoupon = require('../../model/validator/coupon.validate');


// Create coupons
router.post('/create/coupons', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateCoupon),
    Authorize(["all", "write_create"])
], CouponController.CreateCoupon);

// Gell all coupons
router.get('/get/all/coupons', [
    VerifyToken,
    Authorize(["all", "read"])
], CouponController.GetAllCoupons);

// Delete coupons
router.post('/delete/coupons', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["all", "delete"])
], CouponController.DeleteCoupons);

// Delete coupons
router.get('/coupons/download-csv', [
    VerifyToken,
    Authorize(["all", "read"])
], CouponController.DownloadCouponsCsv);


module.exports = router;