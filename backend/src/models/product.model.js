const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "El nombre es necesario"],
      minlength: [4, "El nombre debe contener al menos 4 caracteres"],
    },
    price: {},
    image: {},
    categoryId: {},
    stock: {},
    cost: {},
    supplierId: {},
    sku: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
