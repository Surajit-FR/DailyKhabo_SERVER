const { generateHTMLTemplate } = require("../../helpers/generatePdf");
const OrderModel = require("../../model/order.model");
const UserModel = require("../../model/user.model");
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


// GetMostSoldProducts
exports.GetMostSoldProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    try {
        const result = await OrderModel.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantitySold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    totalQuantitySold: 1,
                    productDetails: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: result });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// GetAllCustomer
exports.GetAllCustomer = async (req, res) => {
    try {
        // Extract search query parameters from request query
        const searchQuery = req.query.searchQuery || '';

        // Aggregation pipeline stages
        const pipeline = [
            {
                $match: { is_delete: false }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                }
            },
            {
                $addFields: {
                    role: { $arrayElemAt: ['$role', 0] }
                }
            },
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'address',
                    foreignField: '_id',
                    as: 'addressDetails'
                }
            },
            {
                $match: { 'role.name': 'User' }
            },
            {
                $addFields: {
                    address: '$addressDetails'
                }
            },
            {
                $match: {
                    $or: [
                        { full_name: { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.address': { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.city': { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.postalCode': { $regex: searchQuery, $options: 'i' } },
                        { 'addressDetails.country': { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    full_name: 1,
                    email: 1,
                    password: 1,
                    web_theme: 1,
                    role: 1,
                    address: '$addressDetails',
                    is_active: 1,
                    is_delete: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ];

        const filtered_data = await UserModel.aggregate(pipeline);

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: filtered_data });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// GetInvoiceDetails
exports.GetInvoiceDetails = async (req, res) => {
    const { order_id } = req.params;
    try {
        // Fetch orders with the constructed query and pagination
        const orders = await OrderModel.findOne({ _id: order_id })
            .populate({
                path: 'items.product',
                select: '-productDescription -productKeyPoints -availability -productQuantity -is_banner -is_featured -is_delete -review -createdAt -updatedAt -__v',
                populate: {
                    path: 'category',
                    select: '-category_desc -is_delete -categoryImage -categoryID -__v -createdAt -updatedAt'
                }
            })
            .populate({
                path: 'customer',
                select: '-__v -createdAt -updatedAt'
            });

        // Respond with success message and product details
        return res.status(200).json({ success: true, message: "Data fetched successfully", data: orders });
    } catch (exc) {
        return res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    };
};

// GenerateInvoicePdf
exports.GenerateInvoicePdf = async (req, res) => {
    const { invoiceDetails } = req.body;

    try {
        // Generate custom HTML content
        const htmlContent = generateHTMLTemplate(invoiceDetails);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        // Open a new page
        const page = await browser.newPage();

        // Set content on the page
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF buffer
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });

        // Close the browser
        await browser.close();

        // Save the PDF temporarily on the server
        const pdfPath = path.join(__dirname, 'temp', 'invoice.pdf');
        fs.writeFileSync(pdfPath, pdfBuffer);

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');

        // Convert the saved PDF file to a blob
        const pdfBlob = fs.readFileSync(pdfPath);

        // Send the PDF blob as response
        res.send(pdfBlob);

        // Delete the temporary PDF file from the server
        fs.unlinkSync(pdfPath);
    } catch (exc) {
        console.error('Error generating PDF:', exc);
        res.status(500).json({ success: false, message: exc.message, error: "Internal server error" });
    }
};