const mongoose = require("mongoose");

exports.handleError = (response, error) => {
  // Errores de validacion de mongoose
  if (error.name === "ValidationError") {
    return response.status(400).json({
      success: false,
      error: "Dato invalido",
      details: Object.values(error.errors).map((error) => error.message),
    });
  }

  //ID invalido
  if (error.name === "CastError") {
    return response.status(400).json({
      success: false,
      error: `ID invalido: ${error.value}`,
    });
  }

  //Duplicacion de datos(email, sku, etc)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return response.status(409).json({
      success: false,
      error: `El ${field} ya existe`,
    });
  }

  //Error de referencia (el documento no existe)
  if (error.message && error.message.includes("Cast to ObjectId failed")) {
    return response.status(40).json({
      success: false,
      error: "Refencia invalida",
    });
  }

  //Error generico del servidor
  console.error("Error no controlado:", error);
  return response.status(500).json({
    success: false,
    error: "Error interno del servidor",
  });
};

exports.asyncHandler = (Function) => {
  return (request, response, next) => {
    Promise.resolve(Function(request, response))
  }
}