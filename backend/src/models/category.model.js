const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "El nombre debe ser mayor a 3 caracteres"],
      trim: true,
      required: [true, "El nombre es necesario"],
      unique: true,
    },
    description: {
      type: String,
      minlength: [25, "La descripcion debe tener mas de 25 caracteres"],
      trim: true,
      required: [true, "La descripcion es necesaria"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
