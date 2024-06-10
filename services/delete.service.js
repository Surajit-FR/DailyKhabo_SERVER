const CartModel = require('../model/cart.model');

// Service to remove a cart item by product_id for a specific user
exports.removeCartItem = async (userId, productId) => {
    try {
        // Find and delete the cart item based on user ID and product ID
        const deletedCartItem = await CartModel.findOneAndDelete({ user: userId, product: productId });

        if (!deletedCartItem) {
            throw new Error("Product not found in the user's cart.");
        }

        return { success: true, message: "Product removed from the cart." };
    } catch (error) {
        return { success: false, message: error.message };
    }
};