const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    orderId: { type: String, required: true },
    customer: {
        email: { type: String, required: true },
        full_name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        apartment: { type: String, required: false },
        country: { type: String, default: 'India' },
        state: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    items: [
        {
            cart: { type: Schema.Types.ObjectId, ref: 'cart', required: true },
            product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    shipping: {
        type: { type: String, enum: ['free', 'paid'], default: 'free' },
        cost: { type: Number, default: 0 },
    },
    payment: { type: String, enum: ['cod', 'stripe'], required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'], required: false, default: 'pending' },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('order', OrderSchema);