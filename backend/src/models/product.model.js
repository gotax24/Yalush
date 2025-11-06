const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "El nombre es necesario"],
      minlength: [4, "El nombre debe contener al menos 4 caracteres"],
    },
    price: {
      type: Number,
      min: [1, "El precio debe ser mayor a 1"],
      required: [true, "El precio es necesario"],
    },
    image: {
      type: String,
      default: null,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "El id de la categoría es necesario"],
    },
    stock: {
      type: Number,
      min: [1, "El stock debe ser mayor a 1"],
      required: [true, "El stock es necesario"],
    },
    cost: {
      type: Number,
      min: [1, "El costo debe ser mayor a 1"],
      required: [true, "El costo es necesario"],
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "El id del proveedor es necesario"],
    },
    sku: {
      type: String,
      required: [true, "El SKU es obligatorio"],
      unique: true,
      trim: true,
      match: [/^[A-Z]{3}-[A-Z]{3}-\d+$/, "Formato de SKU inválido"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
