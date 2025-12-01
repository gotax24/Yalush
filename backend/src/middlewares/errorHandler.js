const AppError = require("../utils/AppError");

//Maneja errores de validaciones de Mongoose
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Datos invalidos: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Maneja errores de cast (ej: ID invalido)
const handleCastError = (err) => {
  const message = `ID invalido: ${err.value}`;
  return new AppError(message, 400);
};

//Maneja errores de duplicacion (ej: email ya existe)
const handleDuplicateFields = (err) => {
  const field = Object.keys(err, keyPattern)[0];
  const message = `El ${field} '${err.keyValue[field]}' ya existe`;
  return new AppError(message, 409);
};

//Middleware principal
const errorHandler = (err, response, request, next) => {
  //Copiamos el error para no podificar el original
  let error = { ...error };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  //Desarrollo mostramos toda la info del error
  if (process.env.NODE_ENV === "development") {
    console.error("Error: ", err);

    return response.status(error.statusCode).json({
      success: false,
      error: error.message,
      stack: err.stack, //Stack trace completo
      details: err, //Objeto completo del error
    });
  }

  //PRODUCCION: ocultamos detalles tecnicos
  //1. Errores de mongose
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFields(err);

  //2. Errores operacionales (los que yo creo)
  if (error.isOperational) {
    return response.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  //3. Errores inesperados(bugs, crashes)
  console.error("Error no controlado: ", err);

  return response.status(500).json({
    success: false,
    error: "Algo salio mal en el servidor",
  });
};

module.exports = errorHandler;
