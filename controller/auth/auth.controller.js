const UserModel = require('../../model/user.model');
const SecurePassword = require('../../helpers/secure_password');
const CreateToken = require('../../helpers/create_token');


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
        const HashedPassword = await SecurePassword(password);
        const NewUser = await UserModel({
            full_name,
            email: email.toLowerCase(),
            password: HashedPassword,
            role
        });

        const userData = await NewUser.save();
        const USER_DATA = { ...userData._doc };
        const tokenData = CreateToken(USER_DATA);
        return res.status(201).json({ success: true, message: "Registered Successfully!", data: USER_DATA, token: tokenData });
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