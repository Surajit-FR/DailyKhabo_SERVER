const JOI = require('joi');

module.exports = (ReviewModel) => {
    const ReviewSchema = JOI.object({
        product: JOI.string().required().messages({
            "string.empty": "A product ID is required!",
        }),
        full_name: JOI.string().required().messages({
            "string.empty": "Full name is required!",
        }),
        email: JOI.string().email().required().messages({
            "string.email": "Please provide a valid email address!",
            "any.required": "Email is required!",
            "string.empty": "Email cannot be empty!",
        }),
        rating: JOI.string().required().messages({
            "any.required": "Rating is required!",
            "string.empty": "Rating cannot be empty!",
        }),
        message: JOI.string().required().messages({
            "any.required": "Message is required!",
            "string.empty": "Message cannot be empty!",
        }),
        is_delete: JOI.boolean().default(false),
        createdAt: JOI.date().optional(),
        updatedAt: JOI.date().optional()
    });

    return ReviewSchema.validate(ReviewModel, { abortEarly: false });
};
