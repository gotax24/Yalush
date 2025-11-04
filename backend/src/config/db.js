const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Base de datos conectada");
  } catch (error) {
    console.error(`Error en conexion: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
