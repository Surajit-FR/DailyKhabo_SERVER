const { deleteUploadedFile } = require('../../helpers/delete_file');
const ProductModel = require('../../model/product.model');
const fs = require('fs');
const path = require('path');

// CreateProduct
exports.CreateProduct = async (req, res) => {
    const { productTitle, offer, offerPercentage, productDescription, price, availability, visibility, category } = req.body;

    try {
        // Check if productImages exist in the request body
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one product image is required!" });
        }

        const productImages = req.files.map(file => file.path.replace('public', ''));

        const NewProduct = new ProductModel({
            productTitle: productTitle.trim(),
            offer: offer.trim(),
            offerPercentage: offerPercentage.trim(),
            productImages: productImages,
            productDescription: productDescription.trim(),
            price: price.trim(),
            availability: availability.trim(),
            visibility: visibility.trim(),
            category: category,
        });

        // Save the product
        await NewProduct.save();
        return res.status(201).json({ success: true, message: "New Product Added successfully!" });

    } catch (exc) {
        // Delete uploaded file if an error occurred during upload
        deleteUploadedFile(req);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// GetAllProduct
exports.GetAllProduct = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Search and filter parameters
        const searchQuery = req.query.search || '';
        const category = req.query.category;

        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

        // Build query object
        let query = { is_delete: false };

        // Add search condition
        if (searchQuery) {
            query.$or = [
                { productTitle: { $regex: searchQuery, $options: 'i' } },
                // { productDescription: { $regex: searchQuery, $options: 'i' } }
            ];
        };

        // Add category filter if category is not empty
        if (category) {
            query.category = category;
        }

        // Add price range filter
        if (minPrice >= 0 && maxPrice < Number.MAX_SAFE_INTEGER) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        // Calculate skip value
        const skip = (page - 1) * pageSize;

        // Fetch products with the constructed query and pagination
        const all_product_data = await ProductModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);

        // Count total number of documents matching the query
        const totalCount = await ProductModel.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pageSize);

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully!",
            data: all_product_data,
            totalPages: totalPages,
            currentPage: page
        });

    } catch (exc) {
        console.log(exc);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// GetProductDetails
exports.GetProductDetails = async (req, res) => {
    const { product_id } = req.params;

    try {
        const productDetails = await ProductModel
            .findOne({ _id: product_id })
            .populate({
                'path': 'category',
                'select': '-createdAt -updatedAt -__v'
            });

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: productDetails });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// UpdateProduct
exports.UpdateProduct = async (req, res) => {
    const { productTitle, offer, offerPercentage, productDescription, price, availability, visibility, category } = req.body;
    const { product_id } = req.params;

    try {
        let updateFields = {
            productTitle: productTitle.trim(),
            offer: offer.trim(),
            offerPercentage: offerPercentage.trim(),
            productDescription: productDescription.trim(),
            price: price.trim(),
            availability: availability.trim(),
            visibility: visibility.trim(),
            category: category,
        };

        // Check if a new product image is uploaded
        if (req.file && req.file.path) {
            // Remove "public" prefix from file path
            const filePath = req.file.path.replace('public', '');
            updateFields.productImage = filePath;
        }

        await ProductModel.findByIdAndUpdate(
            { _id: product_id },
            updateFields,
            { new: true }
        );

        return res.status(200).json({ success: true, message: "Product updated successfully!" });

    } catch (exc) {
        // Delete uploaded file if an error occurred during upload
        if (req.file) {
            deleteUploadedFile(req);
        }
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// DeleteProduct
exports.DeleteProduct = async (req, res) => {
    const { product_id } = req.params;

    try {
        // Find the product by ID
        const product = await ProductModel.findById(product_id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Get the image path
        const imagePath = product.productImage;

        // Construct the correct absolute path
        const absoluteImagePath = path.join(__dirname, '..', '..', 'public', 'product_images', 'uploads', path.basename(imagePath));

        // Delete the product from the database
        await ProductModel.findByIdAndDelete(product_id);

        // Delete the image file from the file system using fs.promises
        fs.unlink(absoluteImagePath, (err) => {
            if (err) {
                console.error("Error deleting image file:", err);
                return res.status(500).json({ success: false, message: "Product deleted but failed to delete image file" });
            };
            return res.status(200).json({ success: true, message: "Product deleted successfully!" });
        });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};