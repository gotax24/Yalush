const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const routes = require();
app.use("/api", routes);

module.exports = app;
