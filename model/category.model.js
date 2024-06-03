const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryID: { type: String, required: true },
    category_name: { type: String, required: true },
    category_desc: { type: String, required: false },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('category', CategorySchema);
