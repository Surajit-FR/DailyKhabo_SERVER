const PermissionModel = require('../../model/permission.model');

// Get all permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await PermissionModel.find();
        return res.status(200).json({ success: true, message: "Data fetched successfully", data: permissions });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Create a new permission
exports.createPermission = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newPermission = new PermissionModel({ name, description });
        await newPermission.save();
        return res.status(201).json({ success: true, message: "Permission created successfully" });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Get a single permission by ID
exports.getPermissionById = async (req, res) => {
    try {
        const permission = await PermissionModel.findById(req.params.id);
        if (!permission) {
            return res.status(404).json({ success: false, message: 'Permission not found' });
        }
        return res.status(200).json({ success: true, message: "Data fetched successfully", data: permission });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Update a permission by ID
exports.updatePermission = async (req, res) => {
    const { name, description } = req.body;
    try {
        const updatedPermission = await PermissionModel.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!updatedPermission) {
            return res.status(404).json({ success: false, message: 'Permission not found' });
        }
        return res.status(200).json({ success: true, message: "Data fetched successfully", data: updatedPermission });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Delete a permission by ID
exports.deletePermission = async (req, res) => {
    try {
        const deletedPermission = await PermissionModel.findByIdAndDelete(req.params.id);
        if (!deletedPermission) {
            return res.status(404).json({ success: false, message: 'Permission not found' });
        }
        return res.status(200).json({ success: true, message: 'Permission deleted successfully' });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};
