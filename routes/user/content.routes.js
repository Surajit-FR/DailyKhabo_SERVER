const express = require('express');
const router = express.Router();
const ContentController = require('../../controller/admin/content.controller');

// Gell all coupons
router.get('/get/policy/:policyName', [
], ContentController.getPolicy);


module.exports = router;