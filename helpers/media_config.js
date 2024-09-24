const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dirPath = (file.fieldname) ? `./public/${file.fieldname}/` : "./public/uploads/";
        fs.mkdirSync(dirPath, { recursive: true });
        cb(null, dirPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const midName = file.originalname.split(".")[0];
        cb(null, midName + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Set file size limits
const maxSize = 20 * 1024 * 1024; // 20 MB for both images and documents

// Update multer config to handle both images and documents
const ImageUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Define allowed MIME types for both images and documents
        const allowedMimeTypes = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        ];

        // Check if the file's MIME type is allowed
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg, .jpeg, .doc, and .docx formats are allowed!"));
        }
    },
    limits: {
        fileSize: maxSize
    }
});

module.exports = { ImageUpload };