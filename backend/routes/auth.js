const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

/* Add a user in DB */
router.post("/signup", authController.signUp);

/* Log user in */
router.post("/login", authController.signIn);

module.exports = router;
