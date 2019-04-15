const express = require("express");

const checkAuth = require('../helpers/check-auth');
const authController = require("../controllers/auth");

const router = express.Router();

/* Get a single user infos */
router.get("/user/:id", authController.getUserProfile);

/* Update notifications status of a user */
router.put("/user", checkAuth, authController.updateNotifStatus);

/* Add a user in DB */
router.post("/signup", authController.signUp);

/* Log user in */
router.post("/login", authController.signIn);

/* Send a reset password link email */
router.post("/newpassword", authController.newPasswordAsk);

/* Confirms user signup */
router.get("/confirmation/:token", authController.confirmation)

/* Set the user's new password */
router.put("/newpassword", checkAuth, authController.newPasswordSet);

module.exports = router;
