const ProductModel = require('../../model/product.model');
const { removeCartItem } = require('../../services/delete.service');

// Middleware to check product stock
exports.CheckProductStock = async (req, res, next) => {
    const { product, cart_quantity } = req.body;

    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;
        // Find the product
        const productData = await ProductModel.findById(product);

        if (!productData) {
            return res.status(404).json({ success: false, message: "Product not found." });
        };

        // Check if cart quantity is invalid (negative or zero)
        if (cart_quantity <= 0) {
            const removeResult = await removeCartItem(userId, product);
            if (!removeResult.success) {
                return res.status(400).json({ success: false, message: removeResult.message });
            }
            return res.status(200).json({ success: true, message: "Product removed from cart." });
        };

        // Check if requested quantity exceeds available stock
        if (cart_quantity > productData.productQuantity) {
            return res.status(400).json({ success: false, message: "Insufficient stock." });
        }

        // Add product data to request for further use
        req.productData = productData;

        next();
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};
