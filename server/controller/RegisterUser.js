const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

async function RegisterUser(req, res) {
  try {
    const { name, email, password, profile_pic } = req.body;
    const CheckEmail = await UserModel.findOne({ email });
    if (CheckEmail) {
      return res.status(400).json({
        message: "User Already exists!",
        error: true,
      });
    }
    // password into hashpassword
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      profile_pic,
      password: hashpassword,
    };

    const user = new UserModel(payload);
    const userSave = await user.save();

    return res.status(201).json({
      message: "User Created Successfully!",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = RegisterUser;
