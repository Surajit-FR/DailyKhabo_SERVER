const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const UtilityController = require('../../controller/admin/utility.controller');
const ReviewFeedbackController = require('../../controller/admin/review_feedback.controller');
// const { trackIP } = require('../../helpers/ip_tracker');

/**************************************************** UTILITY ROUTES ****************************************************/

// Get most sold products
router.get('/get/most-sold/products', [
    VerifyToken,
    Authorize(["all", "read"])
], UtilityController.GetMostSoldProducts);

// Get all Customrs
router.get('/get/all/customers', [
    VerifyToken,
    Authorize(["all", "read"])
], UtilityController.GetAllCustomer);

// Get all Customrs
router.get('/get/invoice/details/:order_id', [
    VerifyToken,
    // Authorize(["all", "read"])
], UtilityController.GetInvoiceDetails);

// Generate invoice-pdf
router.post('/generate/invoice-pdf', [
    VerifyToken,
    // Authorize(["all", "read"])
], UtilityController.GenerateInvoicePdf);

// Get all feedbacks
router.get('/get/testimonials', [
    VerifyToken,
    Authorize(["all", "read"]),
], ReviewFeedbackController.GetAllFeedbacks);

// Mark Feedback
router.post('/mark/feedback/:feedback_id', [
    VerifyToken,
    Authorize(["all"]),
], ReviewFeedbackController.MarkFeedback);

// Delete Feedbacks
router.post('/delete/feedbacks', [
    RequestRate.Limiter,
    VerifyToken,
    Authorize(["all", "delete"])
], ReviewFeedbackController.DeleteFeedbacks);

// router.get('/ip-stats', [trackIP], (req, res) => {
//     res.json(req.ipCounts);
// });


module.exports = router;