const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConatctUsSchema = new Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('contact_us', ConatctUsSchema);
