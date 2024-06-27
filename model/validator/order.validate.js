const JOI = require('joi');

module.exports = (OrderModel) => {
    // Define the order validation schema
    const OrderSchema = JOI.object({
        // Customer information
        customer: JOI.object({
            email: JOI.string().email().required().messages({
                "string.email": "A valid email is required!",
                "any.required": "Customer email is required!"
            }),
            full_name: JOI.string().required().messages({
                "string.empty": "Customer name is required!"
            }),
            phone: JOI.string().min(4).max(10).pattern(/^[0-9]/).messages({
                "string.empty": "User type is missing !!",
                "string.min": "Phone number length should be more than 4 digits",
                "string.max": "Phone number length should be 10 digits long",
                "string.pattern.base": "Only numbers are allowed !!",
            }),
            address: JOI.string().required().messages({
                "string.empty": "Customer address is required!"
            }),
            apartment: JOI.string().allow('').optional(),
            country: JOI.string().default('India'),
            state: JOI.string().required().messages({
                "string.empty": "Customer state is required!"
            }),
            city: JOI.string().required().messages({
                "string.empty": "Customer city is required!"
            }),
            postalCode: JOI.string().pattern(/^\d+$/).required().messages({
                "string.pattern.base": "Postal code must be a valid number!",
                "any.required": "Customer postal code is required!"
            })
        }).required(),
        // Items ordered
        items: JOI.array().items(
            JOI.object({
                cart: JOI.string().regex(/^[a-fA-F0-9]{24}$/).required().messages({
                    "string.pattern.base": "Cart ID must be a valid ObjectId!",
                    "any.required": "Product ID is required!"
                }),
                product: JOI.string().regex(/^[a-fA-F0-9]{24}$/).required().messages({
                    "string.pattern.base": "Product ID must be a valid ObjectId!",
                    "any.required": "Product ID is required!"
                }),
                quantity: JOI.number().integer().positive().required().messages({
                    "number.base": "Quantity must be a number!",
                    "number.integer": "Quantity must be an integer!",
                    "number.positive": "Quantity must be a positive number!",
                    "any.required": "Quantity is required!"
                })
            })
        ).min(1).required().messages({
            "array.min": "At least one item must be ordered!",
            "any.required": "Order items are required!"
        }),
        // Shipping information
        shipping: JOI.object({
            type: JOI.string().valid('free', 'paid').default('free').messages({
                "any.only": "Shipping type must be either 'free' or 'paid'!"
            }),
            cost: JOI.number().min(0).default(0).messages({
                "number.base": "Shipping cost must be a number!",
                "number.min": "Shipping cost must be at least 0!"
            })
        }).required(),
        // Payment information
        payment: JOI.string().valid('cod', 'stripe').required().messages({
            "any.only": "Payment type must be either 'cod' or 'stripe'!",
            "any.required": "Payment type is required!"
        }),
        // Order status
        status: JOI.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending').optional().messages({
            "any.only": "Order status must be one of 'pending', 'processing', 'shipped', 'delivered', 'cancelled'!",
        }),
        // Order totals
        subtotal: JOI.number().positive().required().messages({
            "number.base": "Subtotal must be a number!",
            "number.positive": "Subtotal must be a positive number!",
            "any.required": "Subtotal is required!"
        }),
        discount: JOI.number().default(0).messages({
            "number.base": "Discount must be a number!",
        }),
        total: JOI.number().positive().required().messages({
            "number.base": "Total must be a number!",
            "number.positive": "Total must be a positive number!",
            "any.required": "Total is required!"
        }),
        // Optional timestamps (createdAt and updatedAt)
        createdAt: JOI.date().optional(),
        updatedAt: JOI.date().optional()
    }).unknown(true);

    // Validate the order data
    return OrderSchema.validate(OrderModel, { abortEarly: false });
};
