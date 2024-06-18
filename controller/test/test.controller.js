const ProductModel = require('../../model/product.model');

/********* ALTER DB FIELDS *********/
exports.ModifyDBdata = async (req, res) => {

    await ProductModel.updateMany({}, {
        $set: {
            is_banner: false,
            is_featured: false,
        }
    });

    return res.send("Done.....");
};