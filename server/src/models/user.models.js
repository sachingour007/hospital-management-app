const { Schema, model } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema({
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
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone Number Must Contain Exact 10 Digit"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digit"],
  },
  nicNumber: {
    type: String,
    require: [true, "NIC is required!"],
    minLength: [5, "NIC Number Must Contain Exact 5 Digit"],
    maxLength: [5, "NIC Number Must Contain Exact 5 Digit"],
  },
  gender: {
    type: String,
    required: [true, "Gender is rquired!"],
    enum: ["Male", "Female"],
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});

userSchema.pre("save",)


const User = model("User", userSchema);

module.exports = User;
