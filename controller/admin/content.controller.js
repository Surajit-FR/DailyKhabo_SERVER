const PolicyModel = require("../../model/policy.model");
const mammoth = require('mammoth');
const fs = require('fs');

// addPolicy controller
exports.addPolicy = async (req, res) => {
    const { policyName } = req.body;

    try {
        if (!policyName) {
            return res.status(400).json({ success: false, message: "Policy name is required." });
        };

        // Initialize a variable to store the DOC file content
        let docContent = '';

        // Handle the uploaded DOC file
        if (req.file) {
            const docFile = req.file;
            const filePath = docFile.path;

            // Convert DOC file to HTML using Mammoth
            const result = await mammoth.convertToHtml({ path: filePath });
            docContent = result.value; // HTML content from the DOC file

            // Optional: remove the DOC file after processing
            fs.unlinkSync(filePath);
        } else {
            return res.status(400).json({ success: false, message: "No DOC file uploaded." });
        }

        // Check if the policy already exists to avoid duplicate entries
        const existingPolicy = await PolicyModel.findOne({ policyName });
        if (existingPolicy) {
            return res.status(400).json({ success: false, message: "Policy with this name already exists." });
        }

        // Create a new privacy policy entry in the database
        const newPrivacyPolicy = new PolicyModel({
            policyName,
            description: docContent,
            contentType: "html"
        });

        // Save the new privacy policy document
        await newPrivacyPolicy.save();

        return res.status(201).json({ success: true, message: "Policy added successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// getPolicy controller
exports.getPolicy = async (req, res) => {
    try {
        const { policyName } = req.params;

        // If policyName is provided, fetch a specific policy
        if (policyName) {
            const specificPolicy = await PolicyModel.findOne({ policyName });
            if (!specificPolicy) {
                return res.status(404).json({ success: false, message: "Policy not found." });
            }
            return res.status(200).json({ success: true, data: specificPolicy, message: "Policy fetched successfully." });
        }

        // If no policyName is provided, fetch all policies
        const allPolicies = await PolicyModel.find({});
        return res.status(200).json({ success: true, data: allPolicies, message: "Policies fetched successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, error: "Internal server error" });
    }
};
