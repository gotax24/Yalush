const mongoose = require("mongoose");

const reviewShema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El id del producto es necesario"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El user id es necesario"],
      index: true,
    },
    rating: {
      type: Number,
      min: [1, "El puntuacion debe ser mayor a 1"],
      max: [5, "La puntuacion maxima es 5"],
      required: [true, "Es necesario la puntuacion"],
    },
    comment: {
      type: String,
      minlength: [10, "El comentario debe tener al menos 10 caracteres"],
      maxlength: [500, "El comentario debe tener como maximo 500 caracteres"],
      required: [true, "El comentario es necesario"],
      trim: true,
    },

    //verificar compra
    verified: {
      type: Boolean,
      default: true,
    },
    helpLikeCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//un usuario = un comentario
reviewShema.index({ userId: 1, productId: 1 }, { unique: true });

reviewShema.index({ productId: 1, isActive: 1, createdAt: 1 });

//Obtener el nomber del usuario(sin populate completo)
reviewShema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

//Metodo estatico para calcular el promedio de rating de un producto
reviewShema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { productId: mongoose.Types.ObjectId(productId), isActive: true },
    },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10, //Redondear a 1 decimal
      reviewCount: stats[0].numReviews,
    });
  } else {
    await mongoose
      .model("Product")
      .findByIdAndUpdate(productId, { averageRating: 0, reviewCount: 0 });
  }
};

//middleware: ACtualizar promedio despues de crear/actualizar o elimininar
reviewShema.post("save", function () {
  this.constructor.calcAverageRating(this.productId);
});

reviewShema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.productId);
  }
});

reviewShema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.productId);
  }
});

module.exports = mongoose.model("Reviews", reviewShema);
