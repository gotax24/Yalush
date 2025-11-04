const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Ruta base para probar
app.get("/", (req, res) => {
  res.json({ message: "API Tienda funcionando" });
});

module.exports = app;
