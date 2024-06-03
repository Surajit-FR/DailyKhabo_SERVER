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
        productDescription: JOI.string().allow("").optional(),
        price: JOI.string().required().messages({
            "string.empty": "A price is required!",
        }),
        availability: JOI.string().required().messages({
            "string.empty": "An availability selection is required!",
        }),
        visibility: JOI.string().required().messages({
            "string.empty": "A visibility selection is required!",
        }),
        category: JOI.string().required().messages({
            "string.empty": "A category is required!",
        }),
    });

    return ProductSchema.validate(ProductModel, { abortEarly: false }); // Added abortEarly option to return all validation errors
};