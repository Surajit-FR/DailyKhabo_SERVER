const JOI = require('joi');

module.exports = (ReviewModel) => {
    const ReviewSchema = JOI.object({
        product: JOI.string().required().messages({
            "string.empty": "A product ID is required!",
        }),
        full_name: JOI.string().optional(),
        email: JOI.string().email().optional(),
        rating: JOI.number().required().messages({
            "number.base": "Rating must be a number!",
            "any.required": "Rating is required!",
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
