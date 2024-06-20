const { removeCartItems, updateProductQuantities, expireCoupon } = require('../../helpers/cart_orde');
const OrderModel = require('../../model/order.model');
const ProductModel = require('../../model/product.model');

// TakeOrder
exports.TakeOrder = async (req, res) => {
    try {
        const decoded_token = req.decoded_token;
        const userId = decoded_token._id;
        // Extract order data from the request body
        const { customer, items, shipping, payment, total, couponCode } = req.body;

        // Validate that required fields are present
        if (!customer || !items || items.length === 0 || !payment || total === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Optionally, you might want to validate each product ID and quantity
        for (let item of items) {
            if (!item.product || !item.quantity) {
                return res.status(400).json({ success: false, message: "Invalid items data" });
            }
            const productExists = await ProductModel.exists({ _id: item.product });
            if (!productExists) {
                return res.status(400).json({ success: false, message: `Product with ID ${item.product} does not exist` });
            }
        }

        // Create a new order instance
        const NewOrder = new OrderModel({
            user: userId,
            customer,
            items,
            shipping,
            payment,
            total,
        });

        // Save the order to the database
        await NewOrder.save();
        // Call the function to remove items from the cart
        await removeCartItems(userId, items);
        // Update the product quantities
        await updateProductQuantities(items);
        // Expire the coupon if provided
        if (couponCode) {
            await expireCoupon(couponCode);
        }

        // Respond with success message
        return res.status(201).json({ success: true, message: "Order placed successfully", order: NewOrder });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};