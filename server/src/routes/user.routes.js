const express = require("express");
const router = express.Router();

const { patientRegister, login } = require("../controllers/user.controller.js");

router.route("/patient/register").post(patientRegister);
router.route("/login").post(login);

module.exports = router;
