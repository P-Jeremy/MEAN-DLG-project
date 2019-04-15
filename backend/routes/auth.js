const express = require("express");

const checkAuth = require('../helpers/check-auth');
const authController = require("../controllers/auth");

const router = express.Router();

/* Get a single user infos */
router.get("/user/:id", authController.getUserProfile);

/* Add a user in DB */
router.post("/signup", authController.signUp);

/* Log user in */
router.post("/login", authController.signIn);

router.get("/confirmation/:token", authController.confirmation)

router.post("/newpassword", authController.newPasswordAsk);

router.put("/newpassword", checkAuth, authController.newPasswordSet);

module.exports = router;
