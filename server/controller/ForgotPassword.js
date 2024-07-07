const UserModel = require("../models/UserModel");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

async function ForgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist",
        error: true,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT_KEY, {
      expiresIn: "5m",
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #000; background: linear-gradient(to right, #9959EB, #F58C5A); padding: 20px;">
          <p style="color: #000;">Welcome to <strong>&lt;PrinceDevChat❤/&gt;</strong></p>
          <p style="color: #000;">We received a request to reset your password. Click the link below to choose a new one:</p>
          <a href="http://localhost:5173/forgot-password/${token}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="color: #000;">If you did not request a password reset, please ignore this email.</p>
          <p style="color: #000;">Thank you,<br>PrinceDevChat</p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <img src="https://cdn.pixabay.com/photo/2018/09/19/18/31/keyboard-3689228_1280.jpg" alt="Example Image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;"/>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
        </div>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).json({
          message: error.message || error,
          error: true,
        });
      } else {
        return res.status(200).json({
          message: "Email sent successfully!",
          success: true,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = ForgotPassword;
