const CartModel = require('../model/cart.model');
const CouponModel = require('../model/coupon.model');
const ProductModel = require('../model/product.model');
const { v4: uuidv4 } = require('uuid');

// getAllCartData function for multiple use
exports.getAllCartData = async (userId, couponCode = '') => {
    // Fetch cart data with necessary product fields only
    const cart_data = await CartModel.find({ user: userId })
        .populate({
            path: 'product',
            select: 'productTitle price finalPrice productImages'
        });

    // Prepare the response data
    let subTotalAmount = 0;
    const detailedCartData = cart_data.map(item => {
        const product = item.product;
        const quantity = Number(item.cart_quantity);
        const finalPrice = Number(product.finalPrice);
        const itemTotal = quantity * finalPrice;
        subTotalAmount += itemTotal;

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

        } else {
            throw new Error("Coupon not found or already expired");
        }
    };

    // Calculate shipping charge based on subTotalAmount
    let shippingCharge = 0;
    const freeShippingThreshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 0;

    if (subTotalAmount > freeShippingThreshold) {
        shippingCharge = 0; // Free shipping
    } else {
        shippingCharge = parseFloat(process.env.SHIPPING_CHARGE) || 0;
    };

    // Calculate total amount including shipping charge and discount
    let totalAmount = subTotalAmount - discountAmount + shippingCharge;

    // Prepare the response object for UI
    return {
        data: detailedCartData,
        subTotalAmount: detailedCartData.length > 0 ? Number(subTotalAmount.toFixed(2)) : 0,
        discountAmount: detailedCartData.length > 0 ? Number(discountAmount.toFixed(2)) : 0,
        shippingCharge: detailedCartData.length > 0 ? Number(shippingCharge.toFixed(2)) : 0,
        totalAmountWithShipping: detailedCartData.length > 0 ? Number(totalAmount.toFixed(2)) : 0,
    };
};

// Function to remove items from the cart
exports.removeCartItems = async (userId, items) => {
    for (let item of items) {
        await CartModel.findOneAndDelete({
            _id: item.cart,
            user: userId,
            product: item.product,
        });
    }
};

// Function to update product quantities
exports.updateProductQuantities = async (items) => {
    for (let item of items) {
        // Decrement the product quantity by the item's quantity
        await ProductModel.updateOne(
            { _id: item.product },
            { $inc: { productQuantity: -item.quantity } } // Decrease quantity
        );
    }
};

// Function to expire the coupon
exports.expireCoupon = async (couponCode) => {
    await CouponModel.findOneAndUpdate(
        { discount_coupon: couponCode },
        { $set: { is_expired: true } }
    );
};

// Function to find matching product IDs
exports.findMatchingProductIds = async (regex) => {
    const products = await ProductModel.find({ productTitle: regex }).select('_id');
    return products.map(product => product._id);
};

// generateOrderId function
exports.generateOrderId = () => {
    const uuid = uuidv4();
    const shortUuid = (uuid.replace(/-/g, '').substring(0, 16)).toUpperCase();
    return shortUuid;
}