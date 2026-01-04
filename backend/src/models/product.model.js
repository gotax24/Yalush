const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "El nombre es necesario"],
      minlength: [4, "El nombre debe contener al menos 4 caracteres"],
      maxlength: [50, "El nombre no puede exceder de 50 caracteres"],
      index: true,
    },
    price: {
      type: Number,
      min: [0.01, "El precio debe ser mayor a 0"],
      required: [true, "El precio es necesario"],
      index: true,
      set: (value) => Math.round(value * 100) / 100,
    },
    image: {
      type: String,
      default: null,
      validate: {
        validator: (value) => {
          if (!value) return true;
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            value
          );
        },
        message: "La URL de la imagen no es valida",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "El id de la categoría es necesario"],
      index: true,
    },
    stock: {
      type: Number,
      min: [0, "El stock no puede ser negativo"],
      required: [true, "El stock es necesario"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un numero entero",
      },
    },
    cost: {
      type: Number,
      min: [0.01, "El costo debe ser mayor de 0"],
      required: [true, "El costo es necesario"],
      set: (value) => Math.round(value * 100) / 100,
      select: false,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "El id del proveedor es necesario"],
      index: true,
    },
    sku: {
      type: String,
      required: [true, "El SKU es obligatorio"],
      unique: true,
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z]{3}-[A-Z]{3}-\d+$/,
        "Formato de SKU inválido (Ej: YAL-KEY-001)",
      ],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "El rating no puede ser negativo"],
      max: [5, "La rating maxima es 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "El conteo de reseñas debe ser positivo"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    soldCount: {
      type: Number,
      default: 0,
      min: [0, "Las ventas no pueden ser negativas"],
    },
    lastRestocked: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Virtual para calcular el margen de ganancias
productSchema.virtual("profitMargin").get(function () {
  if (!this.cost || !this.price) return 0;

  return Math.round(((this.price - this.cost) / this.cost) * 100);
});

//El estado del stock
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "sin_stock";
  if (this.stock <= 5) return "bajo_stock";
  if (this.stock <= 20) return "stock_medio";
  return "stock_alto";
});

//indice compuesto para optimizar busquedas por categoria + activos
productSchema.index({ categoryId: 1, isActive: 1 });

//indice compuesto para ordenar por popularidad
productSchema.index({ soldCount: -1, averageRating: -1 });

//middleware previene actualizar campos calculados manualmente
productSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (update.profitMargin || update.stockStatus) {
    return next(new Error("No se pueden modificar campos calculados"));
  }

  next();
});

//metodo para actualizar el stock de forma segura
productSchema.methods.updateStock = async function (quantity, type = "subtra") {
  if (type === "subtract") {
    if (this.stock < quantity) {
      throw new Error("Stock insuficiente");
    }
    this.stock -= quantity;
    this.soldCount += quantity;
  } else if (type === "add") {
    this.stock += quantity;
    this.lastRestocked = new Date();
  }

  return await this.save();
};

productSchema.statics.findLowStock = function (threshold = 5) {
  return this.find({
    stock: { $lte: threshold },
    isActive: true,
  }).sort("stock");
};

module.exports = mongoose.model("Product", productSchema);
