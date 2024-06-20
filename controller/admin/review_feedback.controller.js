const ReviewModel = require('../../model/review.model');

// CreateReview
exports.CreateReview = async (req, res) => {
    const { product, rating, message } = req.body;

    try {
        const decoded_token = req.decoded_token;

        const NewReview = new ReviewModel({
            product: product,
            full_name: decoded_token.full_name,
            email: decoded_token.email,
            rating: rating,
            message: message,
        });

        await NewReview.save();
        return res.status(201).json({ success: true, message: "Review added successfully!" });

    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
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