const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  // is_hot: { type: Boolean, required: true },
  create_at: { type: String, required: true },
  // brand_code: { type: String, required: true }
});
module.exports = mongoose.model('Product', productSchema);