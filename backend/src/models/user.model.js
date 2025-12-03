const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: [true, "El ID de clerk es obligatorio"],
      unique: true,
      trim: true,
      index: true,
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

//Para busquedas frecuentes como "usuarios activos + admin"
userSchema.index({ role: 1, isActive: 1 });

//nombre completo sin almacenar duplicado
userSchema.virtual("fullName").get(() => {
  return `${this.firstName} ${this.lastName}`;
});

//limpia datos antes de guardar
userSchema.pre("save", (next) => {
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
userSchema.methods.isAdmin = () => {
  return this.role === "admin" || this.role === "superAdmin";
};

//actualiza la ultima conexion
userSchema.methods.updateLastLogin = async () => {
  this.lastLogin = new Date();
  return await this.save();
};

//busca por clerkId (patron que se usa mucho)
userSchema.statics.findByClerkId = (clerkId) => {
  return this.findOne({ clerkId, isActive: true });
};

module.exports = mongoose.model("User", userSchema);
