const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/auth/register.controller");
const { login } = require("../controllers/auth/login.controller");
const { clerkWebhook } = require("../controllers/auth/clerkWebhook.controller");

router.post("/register", registerUser);

router.post("/login", login);

router.post("clerk-webhook", clerkWebhook);

module.exports = router;
