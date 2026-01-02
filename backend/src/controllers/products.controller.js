const Product = require("../../models/product.model");
const getAllowedFields = require("../helpers/getAllowedFields");
const AppError = require("../helpers/AppError");
const asyncHandler = require("../helpers/asyncHandler");
const User = require("../models/user.model");

exports.createProduct = async (request, response) => {
  try {
    const product = await Product.create(request.body);

    response.status(201).json(product);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

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

exports.getProducts = async (request, response) => {
  try {
    const products = await Product.find();

    response.status(200).json(products);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (request, response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product)
      return response.status(404).json({ error: "El producto no existe" });

    response.status(200).json(product);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
