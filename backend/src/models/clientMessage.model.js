const mongoose = require("mongoose");
const validator = require("validator")

const clientMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "El nombre es necesario"],
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "El email es necesario"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Correo invalida"],
      lowercase: true,
      validate: [validator.isEmail, "Correo invalido"]
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [100, "El asusnto no puede tener mas de 100 caracteres"],
    },
    message: {
      type: String,
      required: [true, "El mensaje es necesario"],
      minlength: [25, "El mensaje debe tener mas de 25 caracteres"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientMessage", clientMessageSchema);
