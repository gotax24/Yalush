const mongoose = require("mongoose");
const validator = require("validator");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [3, "El nombre debe tener mas de 5 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "El correo es invalido",
      },
      index: true,
    },
    phone: {
      type: String,
      required: [true, "El numero es obligatorio"],
      trim: true,
      unique: true,
      validate: {
        validator: (value) => {
          return /^(04\d{2}[-\s]?\d{7})$/.test(value);
        },
        message: "Formato de telefono invalido (debe ser 04XX-XXXXXXX)",
      },
      index: true,
    },
    address: {
      type: String,
      maxlength: [200, "La direccion no puede exceder 200 caracteres"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Indice compuesto para busquedas comunes
supplierSchema.index({ name: 1, isActive: 1 });

//virtuals para contar productos de este proveedor con relacion
supplierSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  forgeinField: "supplierId",
  count: true,
});

//middleware pre-save para normalizar los telefonos
supplierSchema.pre("save", (next) => {
  if (this.phone) {
    this.phone = this.phone.replace(/[-\s]/g, "");
  }

  next();
});

module.exports = mongoose.model("Supplier", supplierSchema);
