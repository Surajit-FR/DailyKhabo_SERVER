const OrderModel = require("../../model/order.model");
const UserModel = require("../../model/user.model");

// GetMostSoldProducts
exports.GetMostSoldProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    try {
        const result = await OrderModel.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantitySold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    totalQuantitySold: 1,
                    productDetails: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: result });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// GetAllCustomer
exports.GetAllCustomer = async (req, res) => {
    try {
        // Extract search query parameters from request query
        const searchQuery = req.query.searchQuery || '';

        // Aggregation pipeline stages
        const pipeline = [
            {
                $match: { is_delete: false }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                }
            },
            {
                $addFields: {
                    role: { $arrayElemAt: ['$role', 0] }
                }
            },
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'address',
                    foreignField: '_id',
                    as: 'addressDetails'
                }
            },
            {
                $match: { 'role.name': 'User' }
            },
            {
                $addFields: {
                    address: '$addressDetails'
                }
            },
            {
                $match: {
                    $or: [
                        { full_name: { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.address': { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.city': { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.postalCode': { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.country': { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    full_name: 1,
                    email: 1,
                    password: 1,
                    web_theme: 1,
                    role: 1,
                    address: '$addressDetails',
                    is_active: 1,
                    is_delete: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ];

        const filtered_data = await UserModel.aggregate(pipeline);

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: filtered_data });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};