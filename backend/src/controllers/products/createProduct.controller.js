const Product = require("../../models/product.model");

exports.createProduct = async (request, response) => {
  try {
    const product = await Product.create(request.body);

    response.status(201).json(product);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
