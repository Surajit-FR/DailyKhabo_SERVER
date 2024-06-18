const JOI = require('joi');

module.exports = (ProductModel) => {
    const ProductSchema = JOI.object({
        productTitle: JOI.string().required().messages({
            "string.empty": "A product title is required!",
        }),
        offer: JOI.string().valid("true", "false").required().messages({
            "any.required": "An offer selection is required!",
            "any.only": "Offer must be either 'true' or 'false'!"
        }),
        offerPercentage: JOI.when('offer', {
            is: "true",
            then: JOI.string().regex(/^\d+$/).required().messages({
                "string.pattern.base": "Offer percentage must be a valid number!",
                "any.required": "An offer percentage is required!",
            }),
            otherwise: JOI.string().allow("").optional()
        }),
        is_coupon_code: JOI.boolean().default(false),
        // discountCode: JOI.when('is_discount_code', {
        //     is: "true",
        //     then: JOI.string().regex(/^[A-Z0-9]$/).required().messages({
        //         "string.pattern.base": "Discount code must be in the format 'ABC123'!",
        //         "any.required": "Discount code is required when 'Discount code' is true!",
        //         "string.empty": "Discount code cannot be empty when 'Discount code' is true!",
        //     }),
        //     otherwise: JOI.string().allow("").optional()
        // }),
        productDescription: JOI.string().allow("").optional().messages({
            "array.base": "Product description must be in string format!",
        }),
        productKeyPoints: JOI.array().items(JOI.string().allow("")).optional().messages({
            "array.base": "Product key points must be an array of strings!",
        }),
        price: JOI.string().required().messages({
            "string.empty": "A price is required!",
        }),
        availability: JOI.string().required().messages({
            "string.empty": "An availability selection is required!",
        }),
        productQuantity: JOI.number().required().messages({
            "number.base": "Product quantity must be a number!",
            "any.required": "Product quantity is required!",
        }),
        category: JOI.string().required().messages({
            "string.empty": "A category is required!",
        }),
        is_banner: JOI.boolean().default(false),
        is_featured: JOI.boolean().default(false),
        is_delete: JOI.boolean().default(false),
        createdAt: JOI.date().optional(),
        updatedAt: JOI.date().optional()
    });

    return ProductSchema.validate(ProductModel, { abortEarly: false }); // Added abortEarly option to return all validation errors
};