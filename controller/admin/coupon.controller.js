const { generateCouponCode, insertInChunks } = require('../../helpers/generate_coupon_code');
const CouponModel = require('../../model/coupon.model');
const mongoose = require('mongoose');

// Create Coupon
exports.CreateCoupon = async (req, res) => {
    const { couponNumber, discount_amount, expiry_date } = req.body;

    try {
        const coupons = [];

        // Generate all coupon objects in memory
        for (let i = 0; i < Number(couponNumber); i++) {
            const couponCode = generateCouponCode();

            coupons.push({
                discount_coupon: couponCode,
                discount_amount: discount_amount,
                expiry_date: expiry_date,
                is_expired: false
            });
        }

        // Insert coupons in chunks
        await insertInChunks(coupons, CouponModel);

        return res.status(201).json({ success: true, message: `${couponNumber} coupons created successfully!` });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Get all Coupon
exports.GetAllCoupons = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);

        // Calculate skip value
        const skip = (page - 1) * pageSize;

        // Fetch paginated coupons with only necessary fields
        const coupons = await CouponModel.find({}, 'discount_coupon discount_amount expiry_date is_expired')
            .skip(skip)
            .limit(pageSize);

        const now = new Date();
        const updatedCoupons = await Promise.all(
            coupons.map(async (coupon) => {
                const expiryDate = new Date(coupon.expiry_date);
                if (expiryDate < now && !coupon.is_expired) {
                    coupon.is_expired = true;
                    await coupon.save();
                }
                return coupon;
            })
        );

        // Count total number of documents
        const totalCount = await CouponModel.countDocuments({});
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pageSize);

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully!",
            data: updatedCoupons,
            totalPages: totalPages,
            currentPage: page
        });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Delete coupons
exports.DeleteCoupons = async (req, res) => {
    const selectedIDs = req.body;

    try {
        // Validate selectedIDs to ensure they are valid MongoDB ObjectId strings
        const validIDs = selectedIDs.filter(id => mongoose.Types.ObjectId.isValid(id));

        // Delete coupons based on the valid IDs
        const deleteResult = await CouponModel.deleteMany({ _id: { $in: validIDs } });

        return res.json({ success: true, message: `${deleteResult.deletedCount} coupons deleted successfully.` });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};