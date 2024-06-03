const CategoryModel = require('../../model/category.model');

// CreateCategory
exports.CreateCategory = async (req, res) => {
    const { category_name, category_desc } = req.body;
    try {

        const NewCategory = new CategoryModel({
            category_name: category_name.trim(),
            category_desc: category_desc.trim(),
        });
        // Generate categoryID based on _id
        const lastFiveChars = NewCategory._id.toString().slice(-5).toUpperCase();
        const categoryID = `#${lastFiveChars}`;
        NewCategory.categoryID = categoryID;

        await NewCategory.save();
        return res.status(201).json({ success: true, message: "New Category Added successfully!" });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// GetAllCategory
exports.GetAllCategory = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);

        // Calculate skip value
        const skip = (page - 1) * pageSize;

        // Fetch category data with pagination
        const all_category_data = await CategoryModel
            .find({ is_delete: false })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(pageSize);

        // Count total number of documents
        const totalCount = await CategoryModel.countDocuments({ is_delete: false });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pageSize);

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully!",
            data: all_category_data,
            totalPages: totalPages,
            currentPage: page
        });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// UpdateCategory
exports.UpdateCategory = async (req, res) => {
    const { category_name, category_desc } = req.body;
    const { category_id } = req.params;

    try {
        await CategoryModel.findByIdAndUpdate(
            { _id: category_id },
            {
                category_name: category_name.trim(),
                category_desc: category_desc.trim(),
            },
            { new: true }
        );

        return res.status(200).json({ success: true, message: "Category updated successfully!" });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// DeleteCategory
exports.DeleteCategory = async (req, res) => {
    const { category_id } = req.params;

    try {
        // Find and delete the category by ID
        const deletedCategory = await CategoryModel.findByIdAndUpdate(
            { _id: category_id },
            {
                is_delete: true
            },
            { new: true }
        );

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully!"
        });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};
