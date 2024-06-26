const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const ModelAuth = require('../../middleware/auth/model_auth');
const { VerifyToken, Authorize } = require('../../middleware/auth/auth_user');
const PermissionController = require('../../controller/role_permission/permission.controller');
const RoleController = require('../../controller/role_permission/role.controller');
const ValidatePermission = require('../../model/validator/permission.validate');
const ValidateRole = require('../../model/validator/role.validate');

/**************************************************** PERMISSION ROUTES ****************************************************/
// Add new permission
router.post('/add/new/permission', [
    RequestRate.Limiter,
    ModelAuth(ValidatePermission)
], PermissionController.createPermission);

// Get all permission
router.get('/get/all/permission', [
    VerifyToken,
    Authorize(["all"])
], PermissionController.getAllPermissions);


/**************************************************** ROLE ROUTES ****************************************************/
// Add new permission
router.post('/add/new/role', [
    RequestRate.Limiter,
    ModelAuth(ValidateRole)
], RoleController.createRole);

// Get all permission
router.get('/get/all/role', [
    VerifyToken,
    Authorize(["all"])
], RoleController.getAllRoles);


module.exports = router;