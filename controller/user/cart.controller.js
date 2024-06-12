const CartModel = require('../../model/cart.model');
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
            const price = Number(product.price);
            const finalPrice = Number(product.finalPrice);
            const itemTotal = quantity * finalPrice;
            totalAmount += itemTotal;

            return {
                _id: item._id,
                product: {
                    _id: product._id,
                    productTitle: product.productTitle,
                    productImages: product.productImages,
                    price: Number(price.toFixed(2)),
                    finalPrice: Number(finalPrice.toFixed(2)),
                    quantity: quantity,
                    totalPrice: Number(itemTotal.toFixed(2)),
                },
                cart_quantity: Number(item.cart_quantity),
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            };
        });

        return res.status(200).json({
            success: true,
            message: "Cart data fetched successfully",
            data: detailedCartData,
            totalAmount: Number(totalAmount.toFixed(2)),
        });
    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

