const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    address: { type: String, required: true },
    apartment: { type: String, required: false },
    country: { type: String, default: 'India' },
    state: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    primary: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('address', AddressSchema);