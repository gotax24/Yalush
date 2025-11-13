const Product = require("../../models/product.model");

exports.getProducts = async (request, response) => {
  try {
    const products = await Product.find();

    response.status(200).json(products);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
