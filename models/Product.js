const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    image: {
        type:String,
        required:true,
    },
    price: {
        type: Number,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }
});

module.exports = mongoose.model('Product', ProductSchema);