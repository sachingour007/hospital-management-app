const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

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

// /**We bcrypt the password by bcrypJS and mongoose Pre hook method */

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, saltRound);
    user.password = hashPassword;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error nin Compare Password", error);
  }
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    {
      id: this._id,
      Email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = model("User", userSchema);

module.exports = User;
