const Product = require("../../models/product.model");

exports.getProductById = async (request, response) => {
  try {
    const product = await Product.findById(request.params.id);

    if (!product)
      return response.status(404).json({ error: "El producto no existe" });

    response.status(200).json(product);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
