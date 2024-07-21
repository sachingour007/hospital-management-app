const express = require("express");
const router = express.Router();

const { patientRegister } = require("../controllers/user.controller.js");

router.route("/patient/register").post(patientRegister);

module.exports = router;
