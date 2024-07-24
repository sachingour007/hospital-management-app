const { ApiResponse } = require("../utils/ApiResponse");

const generateToken = async (user, statusCode, message, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json(new ApiResponse(statusCode, {user, token}, message));
};

module.exports = { generateToken };
