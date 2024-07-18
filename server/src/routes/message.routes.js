const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/message.controllers.js");

router.route("/send").post(MessageController);

module.exports = router;
