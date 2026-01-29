const mongoose = require('mongoose');

const Schema=mongoose.Schema;
const WishlistSchema = new Schema({
    customer : {
        type: Schema.Types.ObjectId,
        ref: 'customers',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
    }
})
module.exports = mongoose.models('Wishlist',WishlistSchema);