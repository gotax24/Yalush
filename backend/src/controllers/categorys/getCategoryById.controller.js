const Category = require("../../models/category.model");

exports.getCategoryById = async (request, response) => {
  try {
    const category = await Category.findById(request.params.id);

    if (!category)
      return response
        .status(404)
        .json({ error: "No se encontro la categoria" });

    response.status(200).json(category);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
