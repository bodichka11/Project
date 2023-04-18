const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productsSchema);
module.exports = Product;
