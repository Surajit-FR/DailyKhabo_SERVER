const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    designation: { type: String },
    message: { type: String, required: true },
    is_highlighted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('feedback', FeedbackSchema);
