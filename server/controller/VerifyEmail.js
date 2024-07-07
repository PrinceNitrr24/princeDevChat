const UserModel = require("../models/UserModel");
async function VeifyEmail(req, res) {
  try {
    const { email } = req.body;
    const VerifyEmail = await UserModel.findOne({ email }).select("-password");
    if (!VerifyEmail) {
      return res.status(400).json({
        message: "User doesn't exist",
        error: true,
      });
    }

    res.status(200).json({
      message: "Email Verify",
      success: true,
      data: VerifyEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = VeifyEmail;
