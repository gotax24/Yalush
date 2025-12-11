const mongoose = require("mongoose");
const AppError = require("../helpers/AppError");

exports.validateObjectId =
  (paramName = "id") =>
  (request, response, next) => {
    const id = request.params[paramName];

    if (!mongoose.Type.ObjectId.isValid(id)) {
      return next(new AppError(`ID invalido: ${id}`, 400));
    }

    next();
  };
