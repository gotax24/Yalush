const Product = require("../../models/product.model");

exports.deleteProduct = async (request, response) => {
  try {
    const product = await Product.findByIdAndDelete(request.params.id);

    if (!product)
      return response.status(404).json({ error: "El producto no exite" });

    response.status(200).json({ message: "El producto fue eliminado" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
