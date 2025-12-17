const express = require("express");
const { registerNative } = require("../controllers/auth/register.controller");
const { loginNative } = require("../controllers/auth/login.controller");
const { clerkWebhook } = require("../controllers/auth/clerkWebhook.controler");

const router = express.Router();

router.post("/register", registerNative);
router.post("/login", loginNative);
router.post("clerk-webhook", clerkWebhook);

module.exports = router
