const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String},
    color: {type: String},
    type: {type: String, required: true}
})
module.exports = mongoose.model('product', productSchema);