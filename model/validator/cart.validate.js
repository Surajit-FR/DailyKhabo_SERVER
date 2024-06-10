const JOI = require('joi');

module.exports = (CartModel) => {
    const CartSchema = JOI.object({
        product: JOI.string().required().messages({
            "string.empty": "Product ID is required!",
            "any.required": "Product ID is required!"
        }),
        cart_quantity: JOI.number().integer().required().messages({
            "number.base": "Quantity must be a number!",
            "number.integer": "Quantity must be an integer!",
            "any.required": "Quantity is required!"
        }),
    });

    return CartSchema.validate(CartModel);
};
