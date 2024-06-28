// generateHTMLTemplate helper func.
exports.generateHTMLTemplate = (invoiceDetails) => {
    const companyName = process.env.COMPANY_NAME || 'Company Name';
    const companyAddress = process.env.COMPANY_ADDRESS || 'Company Address';
    const companyEmail = process.env.COMPANY_EMAIL || 'company@example.com';
    const companyPhone = process.env.COMPANY_PHONE || '123-456-7890';

    const CUSTOMER_ADDRS = `${invoiceDetails?.customer?.address}, ${invoiceDetails?.customer?.apartment}, ${invoiceDetails?.customer?.country}, ${invoiceDetails?.customer?.state}, ${invoiceDetails?.customer?.city}, ${invoiceDetails?.customer?.postalCode}`

    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" integrity="sha256-2XFplPlrFClt0bIdPgpz8H7ojnk10H69xRqd9+uTShA=" crossorigin="anonymous" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            <style>
                body {
                    margin-top: 20px;
                    background-color: #fff;
                }
                .card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    word-wrap: break-word;
                    background-color: #fff;
                    background-clip: border-box;
                    border-radius: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="container" id='invoice-container'>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="invoice-title">
                            <h4 class="float-end font-size-15">Order ID #${invoiceDetails.orderId}
                                ${invoiceDetails.payment === 'stripe' || invoiceDetails.status === 'delivered' ?
            '<span class="badge bg-success font-size-12 ms-2">Paid</span>' :
            invoiceDetails.payment === 'cod' ?
                '<span class="badge bg-warning font-size-12 ms-2">Unpaid</span>' :
                ''
        }
                            </h4>
                            <div class="mb-4">
                                <h2 class="mb-1 text-muted">${companyName}</h2>
                            </div>
                            <div class="text-muted">
                                <p class="mb-1"><i class="fa fa-map-marker me-1"></i>${companyAddress}</p>
                                <p class="mb-1"><i class="fa fa-envelope me-1"></i>${companyEmail}</p>
                                <p><i class="fa fa-phone me-1"></i>${companyPhone}</p>
                            </div>
                        </div>

                        <hr class="my-4" />

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="text-muted">
                                    <h5 class="font-size-16 mb-3">Billed To:</h5>
                                    <h5 class="font-size-15 mb-2">${invoiceDetails.customer.full_name}</h5>
                                    <p class="mb-1"><i class="fa fa-map-marker me-1"></i>${CUSTOMER_ADDRS}</p>
                                    <p class="mb-1"><i class="fa fa-envelope me-1"></i>${invoiceDetails.customer.email}</p>
                                    <p><i class="fa fa-phone me-1"></i>+91${invoiceDetails.customer.phone}</p>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="text-muted text-sm-end">
                                    <div>
                                        <h5 class="font-size-15 mb-1">Payment Mode:</h5>
                                        <p>${invoiceDetails.payment.toUpperCase()}</p>
                                    </div>
                                    <div class="mt-4">
                                        <h5 class="font-size-15 mb-1">Order Date:</h5>
                                        <p>${new Date(invoiceDetails.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="py-2">
                            <h5 class="font-size-15">Order Summary</h5>

                            <div class="table-responsive">
                                <table class="table align-middle table-nowrap table-centered mb-0">
                                    <thead>
                                        <tr>
                                            <th style="width: 70px;">No.</th>
                                            <th>Item</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th class="text-end" style="width: 120px;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${invoiceDetails.items.map((item, index) => `
                                                <tr key=${index}>
                                                    <th scope="row">${index + 1}</th>
                                                    <td>
                                                        <div>
                                                            <h5 class="text-truncate font-size-14 mb-1">${item.product.productTitle}</h5>
                                                            <p class="text-muted mb-0">${item.product.category.category_name}</p>
                                                        </div>
                                                    </td>
                                                    <td>₹ ${item.product.finalPrice}</td>
                                                    <td>${item.quantity}</td>
                                                    <td class="text-end">₹ ${item.product.finalPrice * item.quantity}</td>
                                                </tr>
                                            `).join('')
        }
                                        <tr>
                                            <th scope="row" colspan="4" class="text-end">Sub Total</th>
                                            <td class="text-end">₹ ${invoiceDetails.subtotal}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" colspan="4" class="border-0 text-end">Discount :</th>
                                            <td class="border-0 text-end">- ₹ ${invoiceDetails.discount}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" colspan="4" class="border-0 text-end">Shipping Charge :</th>
                                            <td class="border-0 text-end">₹ ${invoiceDetails.shipping.cost}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" colspan="4" class="border-0 text-end">Total</th>
                                            <td class="border-0 text-end"><h4 class="m-0 fw-semibold">₹ ${invoiceDetails.total}</h4></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
        </body>
    </html>
`;
};