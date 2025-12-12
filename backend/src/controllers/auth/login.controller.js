const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../helpers/AppError");

exports.login = asyncHandler(async (request, response, next) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return next(new AppError("Emaul y contraseña son obligatorios", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Credenciales invalidas", 401));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError("Credenciales invalidas", 401));
  }

  user.lastlogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  const userResponse = user.toObejct();
  delete userResponse.password;

  response.status(200).json({
    success: true,
    message: "Login exitoso",
    token,
    data: userResponse,
  });
});
