const CartModel = require('../model/cart.model');
const CouponModel = require('../model/coupon.model');

exports.getAllCartData = async (userId, couponCode = '') => {
    // Fetch cart data with necessary product fields only
    const cart_data = await CartModel.find({ user: userId })
        .populate({
            path: 'product',
            select: 'productTitle price finalPrice productImages'
        });

    // Prepare the response data
    let totalAmount = 0;
    const detailedCartData = cart_data.map(item => {
        const product = item.product;
        const quantity = Number(item.cart_quantity);
        const finalPrice = Number(product.finalPrice);
        const itemTotal = quantity * finalPrice;
        totalAmount += itemTotal;

        return {
            _id: item._id,
            product: {
                _id: product._id,
                productTitle: product.productTitle,
                productImages: product.productImages,
                finalPrice: Number(finalPrice.toFixed(2)),
                quantity: quantity,
                totalPrice: Number(itemTotal.toFixed(2)),
            },
            cart_quantity: Number(item.cart_quantity),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
    });

    // Fetching shipping charge based on totalAmount
    let shippingCharge = 0;
    const freeShippingThreshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 0;

    if (totalAmount > freeShippingThreshold) {
        shippingCharge = 0; // Free shipping
    } else {
        shippingCharge = parseFloat(process.env.SHIPPING_CHARGE) || 0;
    };

    // Initialize discountAmount
    let discountAmount = 0;

    // Fetch and apply coupon if provided
    if (couponCode) {
        const coupon = await CouponModel.findOne({ discount_coupon: couponCode, is_expired: false });

        if (coupon) {
            // Check if coupon is expired
            const currentDate = new Date();
            if (coupon.expiry_date && coupon.expiry_date < currentDate) {
                throw new Error("Coupon is expired");
            }
            // Apply the coupon discount
            discountAmount = coupon.discount_amount;
            totalAmount -= discountAmount;

            // // Mark the coupon as expired
            // coupon.is_expired = true;
            // await coupon.save();
        } else {
            throw new Error("Coupon not found or already expired");
        }
    };

    // Calculate total amount including shipping charge
    let totalAmountWithShipping = totalAmount + shippingCharge;

    return {
        data: detailedCartData,
        totalAmount: Number(totalAmount.toFixed(2)),
        shippingCharge: Number(shippingCharge.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        totalAmountWithShipping: Number(totalAmountWithShipping.toFixed(2)),
    };
};