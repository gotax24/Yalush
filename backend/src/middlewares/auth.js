const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../helpers/AppError");
const asyncHandler = require("../helpers/asyncHandler");

exports.protect = asyncHandler(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    token = request.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("No estas autenticado. Por favor inicia sesion", 401)
    );
  }

  let userId;

  
});
