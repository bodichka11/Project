const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");

const getProducts = asyncHandler(async (req, res) => {
  const { type } = req.query;
  console.log(type);

  if (!type) {
    return res.status(400).json({ message: "No types  found" });
  }

  const types = await Product.find({ type: { $regex: new RegExp(type.replace(/\s+/g,"\\s+")), $options: "xi" } });

  console.log(types);

  res.json(types);
});

const createNewProduct = asyncHandler(async (req, res) => {
  const { brand, type, price, url } = req.body;
  if (!brand || !type || !price || !url) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const product = await Product.create({ brand, type, price, url });

  if (product) {
    res
      .status(200)
      .json({ message: `New product ${type}  ${brand} created successfully` });
  } else {
    res.status(400).json({ message: "Invalid product data received" });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product ID Required" });
  }

  const product = await Product.findById(id).exec();
  console.log(product);

  const result = await product.deleteOne();

  const reply = `Name ${result.type} with ID ${result._id} deleted `;

  res.json(reply);
});

module.exports = {
  getProducts,
  createNewProduct,
  deleteProduct,
};
