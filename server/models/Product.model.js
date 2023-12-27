const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    importPrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    category: { type: String, required: true },
    image: [{ type: String, required: true }],
    quantity: {type: Number, required: true},
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
