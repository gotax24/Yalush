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
        validate: function (value) {
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
    refundReason: {
      type: String,
      trim: true,
    },
    refundDate: {
      type: Date,
    },
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    cancelReason: {
      type: String,
      trim: true,
      default: null,
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Indice compuesto para reporte
saleSchema.index({ createdAt: -1, paymentStatus: 1 });
saleSchema.index({ userId: 1, createdAt: -1 });
saleSchema.index({ paymentStatus: 1, typePayment: 1 });

//virtuals calcular cantidad de productos
saleSchema.virtual("totalItems").get(function () {
  return this.products.reduce((sum, product) => sum + product.quantity, 0);
});

//middleware para calcular subtotales antes de guardar
saleSchema.pre("save", function (next) {
  this.products.forEach((item) => {
    item.subtotal = Math.round(item.price * item.quantity * 100) / 100;
  });

  next();
});

//puede ser cancelada?
saleSchema.methods.canBeCancelled = function () {
  return this.paymentStatus === "pending" && this.isActive;
};

//puede ser rembolsada
saleSchema.methods.canBeRefunded = function () {
  const daysSinceSale = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return this.paymentStatus === "paid" && daysSinceSale <= 30;
};

//antes de guardar realiza el numero de la orden
saleSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  next();
});

//metodo para ventas por rango de fechas
saleSchema.statics.getSalesByDateRange = function (starDate, endDate) {
  return this.find({
    createdAt: { $gte: starDate, $lte: endDate },
    paymentStatus: "paid",
    isActive: true,
  });
};

//metodo estatico: ventas por usuario
saleSchema.statics.getTotalByUser = function (userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), isActive: true } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
};

module.exports = mongoose.model("Sales", saleSchema);
