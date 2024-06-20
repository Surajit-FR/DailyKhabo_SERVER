const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    // Customer information
    customer: {
        email: { type: String, required: true },
        full_name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },

        // Add apartment, suite etc. if needed
        apartment: { type: String, required: false },
        // Assuming India is the default country
        country: { type: String, default: 'India' },
        state: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    // Items ordered
    items: [
        {
            cart: { type: Schema.Types.ObjectId, ref: 'cart', required: true },
            product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    // Shipping information
    shipping: {
        type: { type: String, enum: ['free', 'paid'], default: 'free' },
        cost: { type: Number, default: 0 },
    },
    // Payment information
    payment: { type: String, enum: ['cod', 'stripe'], required: true },
    // Order status
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], required: false, default: 'pending' },
    // Order total
    total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('order', OrderSchema);