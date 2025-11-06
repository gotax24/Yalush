const mongoose = require("mongoose");

const reviewShema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El id del producto es necesario"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El user id es necesario"],
    },
    rating: {
      type: Number,
      min: [1, "El puntuacion debe ser mayor a 1"],
      max: [5, "La puntuacion maxima es 5"],
      required: [true, "Es necesario la puntuacion"],
    },
    comment: {
      type: String,
      minlength: [4, "El comentario debe tener al menos 4 caracteres"],
      required: [true, "El comentario es necesario"],
      trim: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reviews", reviewShema);
