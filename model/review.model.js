const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'product' },
    full_name: { type: String, required: false },
    email: { type: String, required: false },
    rating: { type: Number, required: true },
    message: { type: String, required: true },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('review', ReviewSchema);
