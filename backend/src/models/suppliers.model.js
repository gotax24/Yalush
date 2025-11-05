const mongoose = require("mongoose");
const checkEmail = require("../utils/checkEmail");

const suppliersSchema = new mongoose.Schema(
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
      validate: {
        validator: checkEmail(email),
        message: "Correo invalido",
      },
      unique: true,
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

module.exports = mongoose.model("Supplier", suppliersSchema);
