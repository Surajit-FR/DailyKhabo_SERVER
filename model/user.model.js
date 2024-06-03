const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    web_theme: { type: String, default: "" },
    role: { type: Schema.Types.ObjectId, ref: 'role' },
    is_active: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
