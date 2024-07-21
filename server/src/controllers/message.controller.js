const Message = require("../models/message.models.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const MessageController = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (
    [firstName, lastName, email, phone, message].some(
      (field) => field.trim() === ""
    )
  ) {
    return next(new ApiError(400, "Please Fill Full Form"));
  }

  await Message.create({ firstName, lastName, email, phone, message });

  res.status(201).json(new ApiResponse(201, "Message Sent !"));
});

module.exports = MessageController;
