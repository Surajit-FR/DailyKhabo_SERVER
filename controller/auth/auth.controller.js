const UserModel = require('../../model/user.model');
const SecurePassword = require('../../helpers/secure_password');
const CreateToken = require('../../helpers/create_token');
const RoleModel = require('../../model/role.model');


// LoginRegular
exports.LoginRegular = async (req, res) => {
    const { remember_me } = req.body;
    try {
        // Accessing the user object attached by the middleware 
        const _user = req.user;

        const _DATA = await UserModel.findById(_user._id)
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions',
                    select: '-_id -description -createdAt -updatedAt -__v'
                },
                select: '-_id -createdAt -updatedAt -__v -role.permissions'
            })
            .exec();
        const USER_DATA = { ..._DATA._doc, remember_me };
        const tokenData = CreateToken(USER_DATA);
        return res.status(200).json({ success: true, message: "Login Successful!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// RegisterRegular
exports.RegisterRegular = async (req, res) => {
    const { full_name, email, password, role } = req.body;
    try {
        const ROLE = await RoleModel.find({ name: role });

        // Retrive the role's objectId as per user role
        var _role;
        // For role ---> "User"
        if (ROLE[0].name === "User") {
            _role = ROLE[0]._id;
        }
        // For role ---> "SuperAdmin"
        if (ROLE[0].name === "SuperAdmin") {
            _role = ROLE[0]._id;
        }

        const HashedPassword = await SecurePassword(password);
        const NewUser = await UserModel({
            full_name,
            email: email.toLowerCase(),
            password: HashedPassword,
            role: _role,
        });

        const userData = await NewUser.save();
        const USER_DATA = { ...userData._doc };
        const tokenData = CreateToken(USER_DATA);
        return res.status(201).json({ success: true, message: "Registered Successfully!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Verify Email
exports.VerifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(200).json({ success: true, message: "Email Verified. Please set new password!" });
            }
        } else {
            return res.status(404).json({ success: true, message: "Account not found. Double-check your credential.", key: "email" });
        }

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Reset Password
exports.ResetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate the email and password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "Account not found. Double-check your credentials.", key: "email" });
        }

        const HashedPassword = await SecurePassword(password);
        // Update the user's password in the database
        existingUser.password = HashedPassword;
        await existingUser.save();

        return res.status(200).json({ success: true, message: "Password updated successfully!" });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// SetWebSiteTheme
exports.SetWebSiteTheme = async (req, res) => {
    const { web_theme } = req.body;
    try {
        // Accessing the user object attached by the middleware 
        const decoded_token = req.decoded_token;

        const _DATA = await UserModel.findByIdAndUpdate(
            decoded_token._id,
            {
                web_theme: web_theme,
            },
            { new: true }
        ).populate({
            path: 'role',
            populate: {
                path: 'permissions',
                select: '-_id -description -createdAt -updatedAt -__v'
            },
            select: '-_id -createdAt -updatedAt -__v -role.permissions'
        }).exec();

        const USER_DATA = { ..._DATA._doc, remember_me: decoded_token.remember_me };
        const tokenData = CreateToken(USER_DATA);
        return res.status(200).json({ success: true, message: "Theme updated successfully!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};