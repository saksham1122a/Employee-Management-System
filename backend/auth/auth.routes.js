// Defines endpoints:

// POST /api/auth/register
// POST /api/auth/login
// PUT /api/auth/update-name

const express = require("express");
const { registerUser, loginUser, updateUserName } = require("./auth.controller.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update-name", updateUserName);

module.exports = router;