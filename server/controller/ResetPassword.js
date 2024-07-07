const UserModel = require("../models/UserModel");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Log incoming request
  console.log("ResetPassword request received:", { token, password });

  if (!password) {
    return res.status(400).json({
      status: false,
      message: "Password is required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const decoded_id = decoded.id;

    console.log("Decoded token:", decoded);

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate(decoded_id, { password: hashedPassword });

    console.log("Password updated successfully for user:", decoded_id);

    return res.status(200).json({
      status: true,
      message: "Updated Password Successfully!",
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token:", error.message);
      return res.status(400).json({
        status: false,
        message: "Invalid token!",
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expired:", error.message);
      return res.status(400).json({
        status: false,
        message: "Token has expired!",
      });
    }

    console.error("Error resetting password:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = ResetPassword;
