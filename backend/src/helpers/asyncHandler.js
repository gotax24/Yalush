//Este wrapper captura automaticamente errores asincronos y lo pasa al middleware de errores
const asyncHandler = (fn) => {
  return (request, response, next) => {
    //Ejecuta la funcion (fn) del controlador y si hay error, lo pasa a next()
    Promise.resolve(fn(request, response, next)).catch(next);
  };
};

module.exports = asyncHandler;
