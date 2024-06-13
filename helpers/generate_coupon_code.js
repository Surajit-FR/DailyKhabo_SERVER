const { v4: uuidv4 } = require('uuid');

// generateCouponCode function
exports.generateCouponCode = () => {
    const uuid = uuidv4();
    const shortUuid = (uuid.replace(/-/g, '').substring(0, 10)).toUpperCase();
    return shortUuid;
}

// insertInChunks function
exports.insertInChunks = async (array, model) => {
    for (let i = 0; i < array.length; i += process.env.COUPON_CODE_CHUNK_SIZE) {
        const chunk = array.slice(i, i + process.env.COUPON_CODE_CHUNK_SIZE);
        await model.insertMany(chunk);
    }
}