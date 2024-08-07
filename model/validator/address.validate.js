const JOI = require('joi');

module.exports = (AddressModel) => {
    const AddressSchema = JOI.object({
        address: JOI.string().required().messages({
            "string.empty": "Address is required!",
        }),
        phone: JOI.string().required().min(4).max(10).pattern(/^[0-9]/).messages({
            "string.empty": "User type is missing !!",
            "string.min": "Phone number length should be more than 4 digits",
            "string.max": "Phone number length should be 10 digits long",
            "string.pattern.base": "Only numbers are allowed !!",
        }),
        apartment: JOI.string().allow("").optional().messages({
            "string.base": "Apartment must be a string!",
        }),
        country: JOI.string().default('India').messages({
            "string.empty": "Country is required!",
            "any.only": "Country can only be 'India'!",
        }),
        state: JOI.string().required().messages({
            "string.empty": "State is required!",
        }),
        city: JOI.string().required().messages({
            "string.empty": "City is required!",
        }),
        postalCode: JOI.string().required().pattern(/^[0-9]{5,10}$/).messages({
            "string.empty": "Postal Code is required!",
            "string.pattern.base": "Postal Code must be between 5 and 10 digits!",
        }),
    }).unknown(true);

    return AddressSchema.validate(AddressModel);
};