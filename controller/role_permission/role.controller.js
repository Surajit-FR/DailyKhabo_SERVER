// controllers/roleController.js
const RoleModel = require('../../model/role.model');

// Get all roles with permissions populated
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find().populate('permissions');
        return res.status(200).json({ success: true, message: "Data fetched successfully", data: roles });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Create a new role
exports.createRole = async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const newRole = new RoleModel({ name, permissions });
        await newRole.save();
        return res.status(201).json({ success: true, message: "New role created." });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Get a single role by ID with permissions populated
exports.getRoleById = async (req, res) => {
    try {
        const role = await RoleModel.findById(req.params.id).populate('permissions');
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        return res.status(200).json({ success: true, message: "Data fetched successfully", data: role });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Update a role by ID
exports.updateRole = async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const updatedRole = await RoleModel.findByIdAndUpdate(
            req.params.id,
            { name, permissions },
            { new: true }
        );
        if (!updatedRole) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        return res.status(200).json({ success: true, message: "Data fetched successfully", data: updatedRole });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// Delete a role by ID
exports.deleteRole = async (req, res) => {
    try {
        const deletedRole = await RoleModel.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        return res.status(200).json({ success: true, message: 'Role deleted successfully' });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};
