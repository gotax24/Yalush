const mongoose = require("mongoose");
const validator = require("validator");

const saleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Se necesita el id del user"],
      index: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Se necesita el id del producto"],
        },
        name: {
          type: String,
          required: [true, "El nombre del producto es necesario"],
        },
        sku: {
          type: String,
          required: [true, "El SKU es necesario"],
        },
        quantity: {
          type: Number,
          min: [1, "Debe tener al menos 1 digito la cantidad"],
          required: [true, "Es necesario la cantidad el producto"],
        },
        price: {
          type: Number,
          min: [0.01, "Debe ser mayor a 0"],
          required: [true, "Es necesario el precio del producto"],
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: [true, "Es necesario el total de la venta"],
      min: [0.01, "El total debe ser mayor a 0"],
      set: (value) => Math.round(value * 100) / 100,
    },
    typePayment: {
      type: String,
      minlength: [3, "Debe tener al menos 3 caracteres"],
      required: [true, "El tipo de pago es obligatorio"],
      trim: true,
      enum: {
        values: ["pagoMovil", "zelle", "binance", "cash"],
        message: "Estado de pago invalido: {VALUE}",
      },
      index: true,
    },
    paymentStatus: {
      type: String,
      trim: true,
      default: "pending",
      required: [true, "El estatus es necesario"],
      enum: {
        values: ["paid", "pending", "failed", "refunded", "cancelled"],
        message: "Estado de pago invalido",
      },
      index: true,
    },
    transactionInfo: {
      cellphone: {
        type: String,
        trim: true,
        required: [true, "El numero es necesario"],
        validate: {
          validator: (value) => !value || /^04\d{9}$/.test(value),
          message:
            "El numero esta invalido el formato aceptado es (04123456789)",
        },
      },
      refNumber: {
        type: String,
        trim: true,
        validate: (value) => {
          //requerido para pagoMovil y zelle
          if (["pagoMovil", "zelle"].includes(this.typePayment) && !value)
            return false;

          return true;
        },
        message: "Numero de referencia requerido para este metodo de pago",
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "El correo es obligatorio"],
        validate: [validator.isEmail, "Correo invalido"],
      },
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Indice compuesto para reporte
saleSchema.index({ userId: 1, createdAt: -1 });
saleSchema.index({ paymentStatus: 1, typePayment: 1 });

//virtuals calcular cantidad de productos
saleSchema.virtual("totalItems").get(function () {
  return this.products.reduce((sum, product) => sum + product.quantity, 0);
});

//antes de guardar realiza el numero de la orden
saleSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${year}${month}-${(count + 1)
      .toString()
      .padStart(6, "0")}`;
  }

  next();
});

//metodo estatico: ventas por usuario
saleSchema.statics.getTotalByUser = function (userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), isActive: true } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
};

module.exports = mongoose.model("Sales", saleSchema);
