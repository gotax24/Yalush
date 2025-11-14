const Category = require("../../models/category.model");

exports.createCategory = async (request, response) => {
  try {
    const category = await Category.create(request.body);

    response.status(201).json(category);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
