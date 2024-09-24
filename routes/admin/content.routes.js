const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const { ImageUpload } = require('../../helpers/media_config');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const ContentController = require('../../controller/admin/content.controller');

// Add new privacy policy with both image and doc file
router.post('/add/policy', [
    RequestRate.Limiter,
    ImageUpload.single('policyFile'),
    VerifyToken,
    Authorize(["all", "write_create"])
], ContentController.addPolicy);

module.exports = router;