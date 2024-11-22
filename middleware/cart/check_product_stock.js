const ProductModel = require('../../model/product.model');
const { removeCartItem } = require('../../services/delete.service');

// Middleware to check product stock
exports.CheckProductStock = async (req, res, next) => {
    const { product, cart_quantity } = req.body;
    let productsToValidate = [];

    if (Array.isArray(req.body)) {
        productsToValidate = req.body;
    } else {
        productsToValidate = [{ product, cart_quantity }];
    }

    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;

        for (const item of productsToValidate) {
            const productId = item.product;
            const quantity = item.cart_quantity;

            // Find the product
            const productData = await ProductModel.findById(productId);

            if (!productData) {
                return res.status(404).json({ success: false, message: `Product with ID ${productId} not found.` });
            }

            if (quantity <= 0) {
                const removeResult = await removeCartItem(userId, productId);
                if (!removeResult.success) {
                    return res.status(400).json({ success: false, message: removeResult.message });
                }
                return res.status(200).json({ success: true, message: `Product with ID ${productId} removed from cart.` });
            }

            if (quantity > productData.productQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product with ID ${productId}.`,
                });
            }

            item.productData = productData;
        }

        req.productData = productsToValidate;
        next();
        
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};
