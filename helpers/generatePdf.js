exports.formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return `${formattedDate}, ${formattedTime}`;
};

exports.generateHTMLTemplate = (invoiceDetails) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" integrity="sha256-2XFplPlrFClt0bIdPgpz8H7ojnk10H69xRqd9+uTShA=" crossorigin="anonymous" />
            <style>
                body {
                    margin-top: 20px;
                    background-color: #eee;
                }
                .card {
                    box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    word-wrap: break-word;
                    background-color: #fff;
                    background-clip: border-box;
                    border: 0 solid rgba(0, 0, 0, .125);
                    border-radius: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="invoice-title">
                                    <h4 class="float-end font-size-15">Order ID #${invoiceDetails.orderId}
                                        ${invoiceDetails.payment === 'cod' ?
            '<span class="badge bg-warning font-size-12 ms-2">Unpaid</span>' :
            '<span class="badge bg-success font-size-12 ms-2">Paid</span>'}
                                    </h4>
                                    <div class="mb-4">
                                        <h2 class="mb-1 text-muted">${invoiceDetails.companyName}</h2>
                                    </div>
                                    <div class="text-muted">
                                        <p class="mb-1"><i class="fa fa-map-marker me-1"></i>${invoiceDetails.companyAddress}</p>
                                        <p class="mb-1"><i class="fa fa-envelope me-1"></i>${invoiceDetails.companyEmail}</p>
                                        <p><i class="fa fa-phone me-1"></i>${invoiceDetails.companyPhone}</p>
                                    </div>
                                </div>

                                <hr class="my-4" />

                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="text-muted">
                                            <h5 class="font-size-16 mb-3">Billed To:</h5>
                                            <h5 class="font-size-15 mb-2">${invoiceDetails.customer.fullName}</h5>
                                            <p class="mb-1"><i class="fa fa-map-marker me-1"></i>${invoiceDetails.customer.address}</p>
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
                                                <p>${this.formatDateTime(invoiceDetails.createdAt)}</p>
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
                                                `).join('')}
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
                </div>
            </div>
        </body>
        </html>
    `;
}
