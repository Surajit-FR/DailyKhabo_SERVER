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
                $match: { 'role.name': 'User' }
            },
            {
                $project: { 'role.__v': 0, 'role.createdAt': 0, 'role.updatedAt': 0 }
            }
        ];

        const filtered_data = await UserModel.aggregate(pipeline);

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: filtered_data });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};