const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productTitle: { type: String, required: true },
    offer: { type: String, required: true, enum: ['true', 'false'] },
    offerPercentage: { type: String, required: false },
    is_coupon_code: { type: String, required: true, enum: ['true', 'false'] },
    // discountCode: { type: String, required: false },
    productImages: [{ type: String, required: true }],
    productDescription: { type: String, required: false },
    productKeyPoints: [{ type: String, required: false }],
    price: { type: String, required: true },
    finalPrice: { type: Number, required: true },
    availability: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category' },
    review: [{ type: Schema.Types.ObjectId, ref: 'review', default: [] }],
    is_banner: { type: Boolean, default: false },
    is_featured: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('product', ProductSchema);
