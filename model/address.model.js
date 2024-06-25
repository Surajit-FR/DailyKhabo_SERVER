const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    address: { type: String, required: true },
    apartment: { type: String, required: true },
    country: { type: String, default: 'India' },
    state: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('address', AddressSchema);
