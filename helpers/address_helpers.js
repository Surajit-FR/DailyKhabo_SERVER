const UserModel = require('../model/user.model');
const AddressModel = require('../model/address.model');
const CreateToken = require('./create_token');

exports.getUserById = async (userId) => {
    return await UserModel.findById(userId).populate({
        path: 'role',
        populate: {
            path: 'permissions',
            select: '-_id -description -createdAt -updatedAt -__v'
        },
        select: '-_id -createdAt -updatedAt -__v -role.permissions'
    }).populate({
        path: 'address',
        select: '-__v -createdAt -updatedAt'
    });
};

exports.validateAddressOwnership = async (userId, addressId) => {
    return await AddressModel.findOne({ _id: addressId, user: userId });
};

exports.updatePrimaryAddresses = async (userId, addressId) => {
    await AddressModel.updateMany(
        { user: userId, _id: { $ne: addressId } },
        { $set: { primary: false } }
    );
};

exports.createUserToken = (user, rememberMe) => {
    const USER_DATA = { ...user._doc, remember_me: rememberMe };
    return CreateToken(USER_DATA);
};