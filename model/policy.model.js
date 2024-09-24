const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
    policyName: { type: String, required: true },  // Name of the policy (e.g., "privacyPolicy", "termsAndConditions", etc.)
    description: { type: String, required: true }, // Content extracted from the DOC file (HTML format)
    contentType: { type: String, default: "html" } // Type of content (e.g., "html")
}, { timestamps: true });

module.exports = mongoose.model('policy', PolicySchema);