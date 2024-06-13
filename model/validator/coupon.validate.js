const JOI = require('joi');

module.exports = (CouponModel) => {
    const CouponSchema = JOI.object({
        discount_amount: JOI.number().required().messages({
            "number.base": "Discount amount must be a number!",
            "any.required": "Discount amount is required!",
        }),
        is_expired: JOI.boolean().default(false),
        expiry_date: JOI.date().required().messages({
            "date.base": "Expiry date must be a valid date!",
            "any.required": "Expiry date is required!",
        }),
    }).unknown(true);

    return CouponSchema.validate(CouponModel);
};