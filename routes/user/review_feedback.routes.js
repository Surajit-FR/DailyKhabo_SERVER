const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const ReviewFeedbackController = require('../../controller/admin/review_feedback.controller');
const { VerifyToken } = require('../../middleware/auth/auth_user');
const ModelAuth = require('../../middleware/auth/model_auth');
const ValidateReview = require('../../model/validator/review.validate');


// create review
router.post('/create/review', [
    RequestRate.Limiter,
    VerifyToken,
    ModelAuth(ValidateReview),
], ReviewFeedbackController.CreateReview);

// Get all review
router.get('/get/all/reviews', [
], ReviewFeedbackController.GetAllReviews);

module.exports = router;