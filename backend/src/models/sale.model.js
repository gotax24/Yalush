const mongoose = require("mongoose");
const validator = require("validator");

const saleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Se necesita el id del user"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Se necesita el id del producto"],
        },
        quantity: {
          type: Number,
          min: [1, "Debe tener al menos 1 digito la cantidad"],
          required: [true, "Es necesario la cantidad el producto"],
        },
        price: {
          type: Number,
          min: [1, "Debe tener al menos 1 digito el precio"],
          required: [true, "Es necesario el precio del producto"],
        },
      },
    ],
    total: {
      type: Number,
      required: [true, "Es necesario el total de la venta"],
      min: [1, "Debe tener al menos 1 digito el total de la venta"],
    },
    typePayment: {
      type: String,
      minlength: [3, "Debe tener al menos 3 caracteres"],
      required: [true, "El tipo de pago es obligatorio"],
      trim: true,
    },
    paymentStatus: {
      type: String,
      trim: true,
      minlength: [4, "El estatus del pago debe tener al menos 4 caracteres"],
      default: "paid",
      required: [true, "El estatus es necesario"],
      enum: ["paid", "pending", "failed"],
    },
    transactionInfo: {
      cellphone: {
        type: String,
        trim: true,
        minlength: [11, "El numero debe contener al menos 11 digitos"],
        required: [true, "El numero es necesario"],
      },
      refNumber: {
        type: String,
        trim: true,
        required: [true, "El numero de refencia es necesario"],
      },
      email: {
        type: String,
        trim: true,
        required: [true, "El correo es obligatorio"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Correo invalida"],
        validate: [validator.isEmail, "Correo invalido"]
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", saleSchema);
