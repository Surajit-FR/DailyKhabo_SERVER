const UserModel = require('../../model/user.model');
const AddressModel = require('../../model/address.model');
const { getUserById, validateAddressOwnership, updatePrimaryAddresses, createUserToken } = require('../../helpers/address_helpers');

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
        );

        const populatedUser = await getUserById(userId);
        const tokenData = createUserToken(populatedUser, decoded_token.remember_me);

        return res.status(201).json({ success: true, message: "Address added successfully!", data: populatedUser, token: tokenData });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// GetAllAddress
exports.GetAllAddress = async (req, res) => {
    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: user.address });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};

// UpdateUserAddress
exports.UpdateUserAddress = async (req, res) => {
    const { address, apartment, country, state, city, postalCode, primary } = req.body;
    const { address_id } = req.params;

    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        const addressToUpdate = await validateAddressOwnership(userId, address_id);
        if (!addressToUpdate) {
            return res.status(404).json({ success: false, message: "Address not found or does not belong to user" });
        }

        addressToUpdate.address = address;
        addressToUpdate.apartment = apartment;
        addressToUpdate.country = country;
        addressToUpdate.state = state;
        addressToUpdate.city = city;
        addressToUpdate.postalCode = postalCode;
        addressToUpdate.primary = primary;

        await addressToUpdate.save();

        if (primary) {
            await updatePrimaryAddresses(userId, address_id);
        }

        const populatedUser = await getUserById(userId);
        const tokenData = createUserToken(populatedUser, decoded_token.remember_me);

        return res.status(200).json({ success: true, message: "Address updated successfully!", data: populatedUser, token: tokenData });
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

        const user = await getUserById(userId);
        if (!user || !user.address.some(addr => addr._id.equals(address_id))) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        const addressToDelete = user.address.find(addr => addr._id.equals(address_id));

        if (addressToDelete.primary) {
            return res.status(403).json({ success: false, message: "Cannot delete primary address", key: address_id });
        }

        await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { address: address_id } },
            { new: true }
        );

        await AddressModel.findByIdAndDelete(address_id);

        const populatedUser = await getUserById(userId);
        const tokenData = createUserToken(populatedUser, decoded_token.remember_me);

        return res.status(200).json({ success: true, message: "Address deleted successfully!", data: populatedUser, token: tokenData });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};