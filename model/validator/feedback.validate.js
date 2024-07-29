const JOI = require('joi');

module.exports = (FeedbackModel) => {
    const FeedbackSchema = JOI.object({
        full_name: JOI.string().min(3).max(60).required().pattern(/^[a-zA-Z ]+$/).messages({
            "string.empty": "Full name is required!",
            "string.min": "Minimum length should be 3",
            "string.max": "Maximum length should be 60",
            "string.pattern.base": "Only alphabets and blank spaces are allowed",
        }),
        email: JOI.string().min(3).max(60).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'co', 'in'] } }).pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).messages({
            "string.empty": "Email ID is required !!",
            "string.min": "Email ID should be minimum 3 characters long !!",
            "string.max": "Email ID should be maximum 60 characters long !!",
            "string.email": "Invalid email format !!",
            "string.pattern.base": "Invalid email format !!",
        }),
        phone: JOI.allow("").optional(),
        designation: JOI.allow("").optional(),
        message: JOI.string().min(10).max(500).required().messages({
            "string.empty": "Message is required!",
            "string.min": "Minimum length should be 10",
            "string.max": "Maximum length should be 500",
        }),
        is_highlighted: JOI.boolean().default(false),
    });

    return FeedbackSchema.validate(FeedbackModel);
};