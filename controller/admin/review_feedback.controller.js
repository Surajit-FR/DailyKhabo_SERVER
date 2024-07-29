const ReviewModel = require('../../model/review.model');
const ProductModel = require('../../model/product.model');
const FeedbackModel = require('../../model/feedback.model');
const { default: mongoose } = require('mongoose');

// CreateReview
exports.CreateReview = async (req, res) => {
    const { product, rating, message } = req.body;

    try {
        const decoded_token = req.decoded_token;
        // Create a new review document
        const NewReview = new ReviewModel({
            product: product,
            full_name: decoded_token.full_name,
            email: decoded_token.email,
            rating: rating,
            message: message,
        });

        // Save the review document
        const savedReview = await NewReview.save();

        // Add the review to the corresponding product
        await ProductModel.findByIdAndUpdate(
            product,
            { $push: { review: savedReview._id } },
            { new: true, useFindAndModify: false }
        );

        return res.status(201).json({ success: true, message: "Review added successfully!" });

    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// GetAllReviews
exports.GetAllReviews = async (req, res) => {
    const product_id = req?.query?.product_id || '';

    try {
        const review_data = await ReviewModel.find({ product: product_id, is_delete: false }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "Reviews fetched successfully!", data: review_data });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// Feedback
exports.Feedback = async (req, res) => {
    const { full_name, email, phone, designation, message } = req.body;
    try {
        // Create a new review document
        const newFeedback = new FeedbackModel({
            full_name: full_name,
            email: email,
            phone: phone,
            designation: designation,
            message: message,
        });
        await newFeedback.save();

        return res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// GetAllFeedbacks
exports.GetAllFeedbacks = async (req, res) => {
    try {
        const testimonials_data = await FeedbackModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "Reviews fetched successfully!", data: testimonials_data });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// MarkFeedback
exports.MarkFeedback = async (req, res) => {
    const { feedback_id } = req.params;
    try {
        // Fetch the current feedback document
        const feedback = await FeedbackModel.findById(feedback_id);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        // Toggle the is_highlighted field
        const newIsHighlighted = !feedback.is_highlighted;

        // Update the feedback document
        await FeedbackModel.findByIdAndUpdate(
            feedback_id,
            { $set: { is_highlighted: newIsHighlighted } },
            { new: true }
        );

        return res.status(200).json({ success: true, message: "Feedback updated successfully!" });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// DeleteFeedbacks
exports.DeleteFeedbacks = async (req, res) => {
    const selectedIDs = req.body;
    try {
        // Validate selectedIDs to ensure they are valid MongoDB ObjectId strings
        const validIDs = selectedIDs.filter(id => mongoose.Types.ObjectId.isValid(id));

        // Delete coupons based on the valid IDs
        const deleteResult = await FeedbackModel.deleteMany({ _id: { $in: validIDs } });

        return res.json({ success: true, message: `${deleteResult.deletedCount} feedbacks deleted successfully.` });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};