const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    image: {
        type:String,
        required:true,
    },
    status: {
        type: Boolean,
        required: true,
    }
});
//const User = mongoose.model('User');
//module.exports = User;
module.exports = mongoose.model('categories', CategorySchema);