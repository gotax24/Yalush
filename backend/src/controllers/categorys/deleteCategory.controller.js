const Category = require("../../models/category.model");

exports.deleteCategory = async (request, response) => {
  try {
    const category = await Category.findByIdAndDelete(request.params.id);

    if (!category)
      return response.status(404).json({ error: "No se encontro la category" });

    response.status(200).json({ error: "Categoria eliminada" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
