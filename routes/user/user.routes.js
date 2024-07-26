const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const UserController = require('../../controller/user/user.controller');
const UtilityController = require('../../controller/admin/utility.controller');
const { VerifyToken } = require('../../middleware/auth/auth_user');
const ModelAuth = require('../../middleware/auth/model_auth');
const ValidateAddress = require('../../model/validator/address.validate');


// GetUserDetails
router.get('/get/user/details', [
    VerifyToken,
], UserController.GetUserDetails);

// AddUserAddress
router.post('/add/user/address', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateAddress),
], UserController.AddUserAddress);

// GetAllAddress
router.get('/get/user/all-address', [
    VerifyToken,
], UserController.GetAllAddress);

// GetAddress
router.get('/get/address/:address_id', [
    VerifyToken,
], UserController.GetAddress);

// UpdateUserData
router.post('/update/user/data', [
    RequestRate.Limiter,
    VerifyToken,
], UserController.UpdateUserData);

// UpdateUserAddress
router.post('/update/user/address/:address_id', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateAddress),
], UserController.UpdateUserAddress);

// DeleteAddress
router.delete('/delete/address/:address_id', [
    RequestRate.Limiter,
    VerifyToken,
], UserController.DeleteAddress);

// Generate invoice-pdf
router.post('/generate/invoice-pdf', [
    VerifyToken,
], UtilityController.GenerateInvoicePdf);

module.exports = router;