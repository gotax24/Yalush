const mongoose = require("mongoose");
const validator = require("validator")

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [5, "El nombre debe tener mas de 5 caracteres"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Correo invalida"],
      unique: true,
      validate: [validator.isEmail, "El correo es invalido"]
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "El numero es obligatorio"],
      minlength: [11, "El numero debe tener al menos 11 digitos"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);
