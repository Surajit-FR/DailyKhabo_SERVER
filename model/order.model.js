const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
        cart_quantity: { type: Number, required: true },
    }],
    total_amount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('order', OrderSchema);
