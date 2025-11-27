const Category = require("../../models/category.model");

exports.updateCategory = async (request, response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: tru,
        runValidatorsL: true,
      }
    );

    if (!category)
      return response.status(404).json({ error: "No se encontro la category" });

    response.status(200).json(category);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
