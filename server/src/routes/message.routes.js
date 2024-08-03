const express = require("express");
const router = express.Router();
const {
  MessageController,
  allMessages,
} = require("../controllers/message.controller.js");
const { isAdminAuth } = require("../middlewares/auth.middleware.js");

router.route("/send").post(MessageController);
router.route("/getall").get(isAdminAuth, allMessages);

module.exports = router;
