//Esta clase EXTIENDE el error nativo de javascript
//Nos permite crear errores con informacion adicional
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //Llama al constructor de error con el mensaje

    this.statusCode = statusCode;
    //Esto es sencillo si el error empieza con 4 es fail es decir cliente si empieza con 5 es error servidor entonces es error
    this.status = `${statusCode}`.startsWith("4")
      ? "fail con el cliente "
      : "error del servidor";

    this.isOperational = true; //Marca si es un error que podemos anticipar

    //Captura el stack trace (ideal para debuguear)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
