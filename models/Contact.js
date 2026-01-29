const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ContactSchema = new Schema({
    country: {
        type:String,
        required:true,
    },
    address: {
        type:String,
        required:true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});
//const User = mongoose.model('User');
//module.exports = User;
module.exports = mongoose.model('Contact', ContactSchema);