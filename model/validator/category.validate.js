const JOI = require('joi');

module.exports = (CategoryModel) => {
    const CategorySchema = JOI.object({
        category_name: JOI.string().required().messages({
            "string.empty": "A name is required!",
        }),
        category_desc: JOI.allow("").optional(),
    })

    return CategorySchema.validate(CategoryModel);
};