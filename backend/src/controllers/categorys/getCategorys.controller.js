const Category = require("../../models/category.model");

exports.getCategorys = async (request, response) => {
  try {
    const categorys = await Category.find();

    response.status(200).json(categorys);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
