const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
    discount_coupon: { type: String, required: false, unique: true },
    discount_amount: { type: Number, required: true },
    is_expired: { type: Boolean, default: false },
    expiry_date: { type: Date, required: true },
}, { timestamps: true });

CouponSchema.index({ expiry_date: 1 });
CouponSchema.index({ is_expired: 1 });
CouponSchema.index({ createdAt: 1 });

module.exports = mongoose.model('coupon', CouponSchema);
