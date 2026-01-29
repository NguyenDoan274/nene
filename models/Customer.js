const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const customerSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    wishlist:
        [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }]
});

module.exports = mongoose.model('Customer', customerSchema);