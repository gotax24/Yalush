const express = require("express");
const { registerUser } = require("../controllers/auth/register.controller");
const { login } = require("../controllers/auth/login.controller");
const { clerkWebhook } = require("../controllers/auth/clerkWebhook.controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("clerk-webhook", clerkWebhook);

module.exports = router
