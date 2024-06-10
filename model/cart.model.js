const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'product', required: true, index: true },
    cart_quantity: { type: Number, required: true, min: 1 },
}, { timestamps: true });

module.exports = mongoose.model('cart', CartSchema);
