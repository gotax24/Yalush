const mongoose = require("mongoose");
const checkEmail = require("../utils/checkEmail");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      minlength: [5, "El apellido debe tener al menos 5 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      trim: true,
      unique: true,
      minlength: [10, "El correo debe tener al menos 10 caracteres"],
      valeidate: {
        validator: checkEmail(email),
        message: "El correo es invalido",
      },
    },
    admin: {
      type: Boolean,
      required: [true, "El campo es obligatorio"],
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema)