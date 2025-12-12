const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../helpers/AppError");
const generateToken = require("../../helpers/generateToken");

exports.registerUser = asyncHandler(async (request, response, next) => {
  const { email, password, firstName, lastName } = request.body;

  if (!email || !password || !firstName || !lastName) {
    return next(new AppError("Todos los campos son obligatorios", 400));
  }

  if (password.length < 8) {
    return next(new AppError("La contraseña debe tener al menos 8 caracteres"));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("El email ya esta registrado", 409));
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    authMethod: "native",
  });

  const token = generateToken(user._id);

  const userResponse = user.toObject();
  delete userResponse.password;

  response.status(201).json({
    success: true,
    message: "Usuario registrado exitosamente",
    token,
    data: userResponse,
  });
});
