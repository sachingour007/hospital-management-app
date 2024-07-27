const User = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const isAdminAuth = asyncHandler(async (req, _, next) => {
  const token = req.cookies.adminToken;
  
  if (!token) {
    return next(new ApiError(400, "Admin Not Authenticated!"));
  }
  const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decodeToken) {
    return next(new ApiError(400, "Token is Wrong!"));
  }

  req.user = await User.findById(decodeToken.id);
  if (req.user.role !== "Admin") {
    return next(
      new ApiError(403, `${req.user.role} not authorized for this resource!`)
    );
  }

  next();
});

const isPatientAuth = asyncHandler(async (req, _, next) => {
  const token = req.cookies.patientToken;

  if (!token) {
    return next(new ApiError(400, "User Not Authenticated!"));
  }
  const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decodeToken) {
    return next(new ApiError(400, "Token is Wrong!"));
  }
  req.user = await User.findById(decodeToken.id);

  if (req.user.role !== "Patient") {
    return next(
      new ApiError(403, `${req.user.role} not authorized for this resource!`)
    );
  }

  next();
});

module.exports = { isAdminAuth, isPatientAuth };
