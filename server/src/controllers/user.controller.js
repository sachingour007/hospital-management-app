const User = require("../models/user.models.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { generateToken } = require("../utils/jwtToken");

const patientRegister = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    nicNumber,
    gender,
    role,
  } = req.body;

  if (
    [
      firstName,
      lastName,
      email,
      phone,
      dob,
      password,
      nicNumber,
      gender,
      role,
    ].some((field) => field.trim() === "")
  ) {
    return next(new ApiError(400, "Please Fill Full Form"));
  }

  const userExist = await User.findOne({ email });
  console.log(userExist);
  if (userExist) {
    return next(new ApiError(400, "User Already Registered!"));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    nicNumber,
    gender,
    role,
  });

  const userCreated = await User.findById(user._id).select("-password");

  generateToken(userCreated, 200, "User registered successfully!", res);
  // res
  //   .status(200)
  //   .json(new ApiResponse(200, userCreated, "User registered successfully"));
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if ([email, password, role].some((field) => field.trim() === "")) {
    return next(new ApiError(400, "Please Provide the all details"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(400, "Invalid Password or Email"));
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);

  if (!isPasswordMatched) {
    return next(new ApiError(400, "Invalid Password or Email"));
  }

  if (role !== user.role) {
    return next(new ApiError(400, "User with this Role Not Found"));
  }
  const userDetails = await User.findOne(user._id).select("-password");

  generateToken(userDetails, 200, "User Logged In Successfully!", res);
});

const adminRegister = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    nicNumber,
    gender,
  } = req.body;
  if (
    [firstName, lastName, email, phone, dob, password, nicNumber, gender].some(
      (field) => field.trim() === ""
    )
  ) {
    return next(new ApiError(400, "Please Fill Full Form"));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ApiError(400, `${isRegistered.role} already Exits with Same Email!`)
    );
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    nicNumber,
    gender,
    role: "Admin",
  });

  const adminCreated = await User.findById(admin._id).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, adminCreated, "New Admin Registered!"));
});

const getAllDoctors = asyncHandler(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json(new ApiResponse(200, doctors, "All Doctors! "));
});

const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json(new ApiResponse(200, user, "All Users! "));
});

module.exports = {
  patientRegister,
  login,
  adminRegister,
  getAllDoctors,
  getUserDetails,
};
