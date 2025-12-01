const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, //Limite de 100 peticiones en 15 minutos
    message: "Demasiadas peticiones en poco tiempo intente mas tarde",
  })
);

// Conexión a la base de datos
connectDB();

// Ruta base para probar
app.get("/", (req, res) => {
  res.json({ message: "API Tienda funcionando" });
});
//De ultimo ya que los middleware se debe de ir de ultimo
app.use(errorHandler)
module.exports = app;
