const jwt = require("jsonwebtoken");
const axios = require("axios");
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

  //verificar con clerk API
  try {
    const clerkResponse = await axios.get(
      "https://api.clerk.dev/v1/sessions/verify",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!clerkResponse.ok) {
      return next(new AppError("Token invalido o expirado", 401));
    }

    const clerkData = await clerkResponse.json();
    const clerkId = clerkData.user_id;

    //Buscar usuario por clerkId
    const user = User.findOne({ clerkId });

    if (!user) return next(new AppError("Usuario no encontrado", 404));

    user = user._id;
  } catch (error) {
    return next(new AppError("Token invalido", 401));
  }

  const user = await User.findById(userId).select("-password");

  if (!user || !user.isActive) {
    return next(new AppError("Usuario no encontrado o inactivo", 404));
  }

  request.user = user;

  next();
});
