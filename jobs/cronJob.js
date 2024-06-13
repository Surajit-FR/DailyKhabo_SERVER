const cron = require('node-cron');
const CouponModel = require('../model/coupon.model');

module.exports = () => {
    // Schedule a job to update expired coupons every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        const now = new Date();
        try {
            const result = await CouponModel.updateMany(
                { expiry_date: { $lt: now }, is_expired: false },
                { $set: { is_expired: true } }
            );
            console.log(`Expired coupons updated successfully: ${result.modifiedCount} documents modified.`);
        } catch (error) {
            console.error('Error updating expired coupons:', error);
        }
    });
};
