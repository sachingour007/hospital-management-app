const User = require("../models/user.models.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { generateToken } = require("../utils/jwtToken");
const cloudinary = require("cloudinary");

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

const logoutAdmin = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("adminToken", "", {
      httpOnly: true,
      expire: new Date(Date.now()),
      secure: true,
    })
    .json(new ApiResponse(200, {}, "Admin Logged Out Successfully!"));
});

const logoutPatient = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
    })
    .json(new ApiResponse(200, {}, "patient Logged Out Successfully!"));
});

const addNewDoctor = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ApiError(400, "Doctor Avtar Required"));
  }

  console.log(req.files);
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ApiError(400, "File Formate not Supported!"));
  }

  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    nicNumber,
    gender,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !dob ||
    !nicNumber ||
    !gender ||
    !doctorDepartment
  ) {
    return next(new ApiError(400, "Please Provide Full Details!"));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ApiError(400, `${isRegistered.role} already Exist with Email!`)
    );
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(
      "cloudinary Error",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
  }
  console.log("cloudinaryResponse :", cloudinaryResponse);

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    nicNumber,
    gender,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  const DoctorDetails = await User.findById(doctor._id).select("-password");

  res
    .status(200)
    .json(
      new ApiResponse(200, DoctorDetails, "New Doctor Register Successfully!")
    );
});

module.exports = {
  patientRegister,
  login,
  adminRegister,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient,
  addNewDoctor,
};
