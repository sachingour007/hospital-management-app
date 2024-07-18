const { Schema, default: mongoose } = require("mongoose");
const validator = require("validator");

const messageSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please Provide A Valid Email"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone Number Must Contain Exact 10 Digit"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digit"],
  },
  message: {
    type: String,
    required: true,
    minLength: [10, "Message Must Contain At least 10 Character!"],
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
