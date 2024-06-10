// delete_file.js
const fs = require('fs');

exports.deleteUploadedFile = async (req) => {
    if (req?.files) {
        try {
            await fs.promises.unlink(req.file.path);
            console.log("File deleted successfully");
        } catch (err) {
            console.error("Error deleting file:", err);
            throw err;
        };
    };
};
