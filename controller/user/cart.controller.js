const { getAllCartData } = require('../../helpers/get_all_cart_data');
const CartModel = require('../../model/cart.model');
const CouponModel = require('../../model/coupon.model');
const { removeCartItem } = require('../../services/delete.service');

// AddCart
exports.AddCart = async (req, res) => {
    const { product, cart_quantity } = req.body;

    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        // Check if the product already exists in the user's cart
        let existingCart = await CartModel.findOne({ user: userId, product: product });

        if (existingCart) {
            // If product exists, update the quantity
            const newQuantity = existingCart.cart_quantity + cart_quantity;
            // Ensure new quantity does not exceed available stock
            if (newQuantity > req.productData.productQuantity) {
                return res.status(400).json({ success: false, message: "Insufficient stock." });
            }
            existingCart.cart_quantity = newQuantity;
            await existingCart.save();
            return res.status(200).json({ success: true, message: "Product quantity updated in the cart." });
        } else {
            // If product does not exist, create a new cart item
            const newCart = new CartModel({
                user: userId,
                product: product,
                cart_quantity: cart_quantity,
            });
            await newCart.save();
            return res.status(201).json({ success: true, message: "Product added to the cart." });
        }
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Increase & Decrease product quantity in cart
exports.UpdateCartQuantity = async (req, res) => {
    const { product, cart_quantity } = req.body;

    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        // Find the existing cart item
        let existingCart = await CartModel.findOne({ user: userId, product: product });

        if (!existingCart) {
            return res.status(404).json({ success: false, message: "Product not found in cart." });
        }

        // Update quantity
        const newQuantity = cart_quantity;

        // Ensure new quantity does not exceed available stock
        if (newQuantity > req.productData.productQuantity) {
            return res.status(400).json({ success: false, message: "Insufficient stock." });
        }

        existingCart.cart_quantity = newQuantity;
        await existingCart.save();
        return res.status(200).json({ success: true, message: "Product quantity updated in the cart." });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// DeleteCartItem
exports.DeleteCartItem = async (req, res) => {
    const { product_id } = req.params;
    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        const removeResult = await removeCartItem(userId, product_id);
        if (!removeResult.success) {
            return res.status(400).json({ success: false, message: removeResult.message });
        }
        return res.status(200).json({ success: true, message: "Product removed from cart." });

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// GetAllCartData
exports.GetAllCartData = async (req, res) => {
    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;
        const couponCode = req.query.couponCode || '';
        
        const cartData = await getAllCartData(userId, couponCode);

        return res.status(200).json({
            success: true,
            message: "Cart data fetched successfully",
            ...cartData
        });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message });
    }
};

// ApplyCoupon
exports.ApplyCoupon = async (req, res) => {
    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;
        const { couponCode } = req.body;

        if (!couponCode) {
            return res.status(400).json({ success: false, message: "Coupon code is required" });
        }

        const cartData = await getAllCartData(userId, couponCode);

        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully.",
            ...cartData
        });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message });
    }
};