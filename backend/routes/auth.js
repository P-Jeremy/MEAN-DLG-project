const express = require("express");

const checkAuth = require("../helpers/check-auth");
const authController = require("../controllers/auth");

const router = express.Router();

/* Add a user in DB */
router.post("/signup", authController.signUp);

/* Confirms user signup */
router.get("/confirmation/:token", authController.confirmation);

/* Log user in */
router.post("/login", authController.signIn);

/* Get a single user infos */
router.get("/user", checkAuth, authController.getUserProfile);

/* Update isActive & isAdmin to false and isDeleted to true for a user */
router.delete("/user/profile", checkAuth, authController.deleteUser);

/* Change the user's pseudo */
router.put("/user/pseudo", checkAuth, authController.updatePseudo);

/* Update notifications status of a user */
router.put("/user/notifications", checkAuth, authController.updateNotifStatus);

/* Send a reset password link email */
router.post("/newpassword", authController.newPasswordAsk);

/* Set the user's new password */
router.put("/newpassword", checkAuth, authController.newPasswordSet);

module.exports = router;
