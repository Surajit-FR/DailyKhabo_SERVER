// delete_file.js
const fs = require('fs');

exports.deleteUploadedFiles = async (req) => {
    if (req?.files && Array.isArray(req.files)) {
        const deletePromises = req.files.map(file => {
            return fs.promises.unlink(file.path)
                .then(() => {
                    console.log(`File deleted successfully: ${file.path}`);
                })
                .catch(err => {
                    console.error(`Error deleting file (${file.path}):`, err);
                    throw err;  // You can choose to throw the error or handle it differently.
                });
        });

        // Wait for all delete operations to complete
        try {
            await Promise.all(deletePromises);
            console.log("All files deleted successfully");
        } catch (err) {
            console.error("Error deleting one or more files:", err);
            throw err;
        }
    } else {
        console.log("No files to delete");
    }
};