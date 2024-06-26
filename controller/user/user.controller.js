const UserModel = require('../../model/user.model');
const AddressModel = require('../../model/address.model');
const CreateToken = require('../../helpers/create_token');

// AddUserAddress
exports.AddUserAddress = async (req, res) => {
    const { address, apartment, country, state, city, postalCode } = req.body;

    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        // Check if the user already has addresses
        const user = await UserModel.findById(userId);
        const isFirstAddress = user.address.length === 0;

        const newAddress = new AddressModel({
            user: userId,
            address,
            apartment,
            country,
            state,
            city,
            postalCode,
            primary: isFirstAddress,
        });

        const savedAddress = await newAddress.save();
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { address: savedAddress._id } },
            { new: true }
        ).populate({
            path: 'address',
            select: '-__v -createdAt -updatedAt'
        });

        const USER_DATA = { ...updatedUser._doc, remember_me: decoded_token.remember_me };
        const tokenData = CreateToken(USER_DATA);

        return res.status(201).json({ success: true, message: "Address added successfully!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// GetAllAddress
exports.GetAllAddress = async (req, res) => {
    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;
        const user = await UserModel.findById(userId).populate({
            path: 'address',
            select: '-__v -createdAt -updatedAt'
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "Data fethced successfully!", data: user.address });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// DeleteAddress
exports.DeleteAddress = async (req, res) => {
    const { address_id } = req.params;

    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        // Find the user and check if the address_id exists in their addresses
        const user = await UserModel.findById(userId).populate('address');
        if (!user || !user.address.some(addr => addr._id.equals(address_id))) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        // Find the address document
        const addressToDelete = user.address.find(addr => addr._id.equals(address_id));

        // Check if the address is primary
        if (addressToDelete.primary) {
            return res.status(403).json({ success: false, message: "Cannot delete primary address", key: address_id });
        }

        // Remove the address from the user's address array
        await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { address: address_id } },
            { new: true }
        );

        // Remove the address from the Address collection
        await AddressModel.findByIdAndDelete(address_id);

        // Fetch the updated user data
        const updatedUser = await UserModel.findById(userId).populate({
            path: 'address',
            select: '-__v -createdAt -updatedAt'
        });

        const USER_DATA = { ...updatedUser._doc, remember_me: decoded_token.remember_me };
        const tokenData = CreateToken(USER_DATA);

        return res.status(200).json({ success: true, message: "Address deleted successfully!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};