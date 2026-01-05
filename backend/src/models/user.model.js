const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const asyncHandler = require("../helpers/asyncHandler");
const AppError = require("../helpers/AppError");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Formato de correo invalido",
      },
      index: true, //optimiza busquedas por email
    },
    clerkId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      minlength: [8, "La contraseña debe tener minimo 8 caracteres"],
      select: false,
      require: function () {
        return this.authMethod === "native";
      },
    },
    authMethod: {
      type: String,
      enum: ["clerk", "native"],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      minlength: [5, "El apellido debe tener al menos 5 caracteres"],
      maxlength: [50, "El apellido no puede exceder 50 caracteres"],
    },
    profileImageUrl: {
      type: String,
      default: null,
      validate: {
        //valida si hay valor y retorna un url
        validator: (value) => {
          if (!value) return true;
          return validator.isURL(value, { protocols: ["http", "https"] });
        },
        message: "La URL de la imagen no es valida",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "superAdmin"],
        message: "Rol invalido: {VALUE}",
      },
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, //permite campos calculados
    toObject: { virtuals: true },
  }
);

//Un usuario debe tener clerkId o password(Al menos uno)
userSchema.pre("validate", function (next) {
  if (!this.clerkId && !this.password) {
    return next(new AppError("El usuasrio debe tener clerkId o password"));
  }

  next();
});

/*
userSchema.pre(/^find/, function () {
  this.where({ isActive: true });
});
*/

userSchema.pre("validate", function (next) {
  if (this.authMethod === "native" && !this.password) {
    return next(new AppError("Usuario nativos requieren contraseñas", 400));
  }

  if (this.authMethod === "clerk" && !this.clerkId) {
    return next(new AppError("Usuarios clerk requieren clerkId", 400));
  }

  next();
});

userSchema.pre("save", async (next) => {
  if (!this.isModified("password") || !this.password) return next();

  //Hashear con bcrypt (10 rounds = equilibrio seguridad/velocidad)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  //Si el usuario no tiene password (vino por clerkId) retorna false
  if (!this.password) return false;

  return await bcrypt.compare(candidatePassword, this.password);
};

//Para busquedas frecuentes como "usuarios activos + admin"
userSchema.index({ role: 1, isActive: 1 });

//nombre completo sin almacenar duplicado
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//limpia datos antes de guardar
userSchema.pre("save", function (next) {
  //normalizar el email
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase().trim();
  }

  //capitaliza nombres
  if (this.isModified("firstName")) {
    this.firstName =
      this.firstName.charAt(0).toUpperCase() +
      this.firstName.slice(1).toLowerCase();
  }

  if (this.isModified("lastName")) {
    this.lastName =
      this.lastName.charAt(0).toUpperCase() +
      this.lastName.slice(1).toLowerCase();
  }

  next();
});

//verifica si el usuario es admin
userSchema.methods.isAdmin = function () {
  return this.role === "admin" || this.role === "superAdmin";
};

//actualiza la ultima conexion
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

//busca por clerkId (patron que se usa mucho)
userSchema.statics.findByClerkId = function (clerkId) {
  return this.findOne({ clerkId, isActive: true });
};

//
userSchema.index({ isActive: 1, role: 1, createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
