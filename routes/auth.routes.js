const express = require('express');
const router = express.Router();
const RequestRate = require('../helpers/request_limiter');
const ModelAuth = require('../middleware/auth/model_auth');
const { HandleRegularLoginError } = require('../middleware/auth/creds_validation');
const { DuplicateUserCheck } = require('../middleware/auth/duplicate_check');
const AuthController = require('../controller/auth/auth.controller');
const ValidateUser = require('../model/validator/user.validate');
const { VerifyToken } = require('../middleware/auth/auth_user');

/**************************************************** ADMIN AUTH ROUTES ****************************************************/

// Sign-Up
router.post('/register', [RequestRate.Limiter, ModelAuth(ValidateUser), DuplicateUserCheck], AuthController.RegisterRegular);
// Login
router.post('/login', [RequestRate.Limiter, HandleRegularLoginError], AuthController.LoginRegular);
// Verify email
router.post('/verify/email', [RequestRate.Limiter], AuthController.VerifyEmail);
// Reset password
router.post('/reset/password', [RequestRate.Limiter], AuthController.ResetPassword);
// update theme
router.post('/update/theme', [RequestRate.Limiter, VerifyToken], AuthController.SetWebSiteTheme);


module.exports = router;