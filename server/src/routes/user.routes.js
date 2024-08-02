const express = require("express");
const router = express.Router();
const {
  isAdminAuth,
  isPatientAuth,
} = require("../middlewares/auth.middleware.js");
const {
  patientRegister,
  login,
  adminRegister,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient,
} = require("../controllers/user.controller.js");

router.route("/patient/register").post(patientRegister);
router.route("/login").post(login);
router.route("/admin/addnew").post(isAdminAuth, adminRegister);
router.route("/doctors").get(getAllDoctors);
router.route("/admin/me").get(isAdminAuth, getUserDetails);
router.route("/patient/me").get(isPatientAuth, getUserDetails);
router.route("/admin/logout").get(isAdminAuth, logoutAdmin);
router.route("/patient/logout").get(isPatientAuth, logoutPatient);

module.exports = router;
