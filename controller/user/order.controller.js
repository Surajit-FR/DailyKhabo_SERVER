const { removeCartItems, updateProductQuantities, expireCoupon, findMatchingProductIds } = require('../../helpers/cart_order');
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

// Get all order
exports.GetAllOrder = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Search parameter
        const searchQuery = req.query.searchQuery || '';

        // Date range parameters
        // const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        // const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        // Build query object
        let query = {};

        // Add search condition for productTitle
        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex
            query['items.product'] = { $in: await findMatchingProductIds(regex) };
        };

        // Add date range filter
        // if (startDate && endDate) {
        //     query.createdAt = { $gte: startDate, $lte: endDate };
        // }

        // Calculate skip value
        const skip = (page - 1) * pageSize;

        // Fetch orders with the constructed query and pagination
        const orders = await OrderModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate({
                path: 'items.product',
                select: 'productTitle price productImages'
            })
            .populate({
                path: 'customer',
                select: '-__v -createdAt -updatedAt'
            });

        // Count total number of documents matching the query
        const totalCount = await OrderModel.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pageSize);

        // Process orders and extract product details
        const productDetails = orders.flatMap(order =>
            order.items.map(item => ({
                _id: item.product._id,
                order_id: order._id,
                productTitle: item.product.productTitle,
                price: item.product.price,
                productImages: item.product.productImages,
                totalQuantity: item.quantity,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                customer: {
                    email: order.customer.email,
                    full_name: order.customer.full_name,
                    phone: order.customer.phone,
                    address: order.customer.address,
                    apartment: order.customer.apartment,
                    country: order.customer.country,
                    state: order.customer.state,
                    city: order.customer.city,
                    postalCode: order.customer.postalCode,
                },
                shipping: {
                    type: order.shipping.type,
                    cost: order.shipping.cost,
                },
                payment: order.payment,
                total: order.total
            }))
        );

        // Calculate the range of items displayed on the current page
        const startIndex = skip + 1;
        const endIndex = Math.min(skip + pageSize, totalCount);

        // Respond with success message and product details
        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data: productDetails,
            totalPages: totalPages,
            currentPage: page,
            totalItems: totalCount,
            showing: {
                startIndex: startIndex,
                endIndex: endIndex
            }
        });
    } catch (exc) {
        console.error(exc.message);
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};