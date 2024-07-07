const express = require("express");
const RegisterUser = require("../controller/RegisterUser");
const VerifyEmail = require("../controller/VerifyEmail");
const VerifyPassword = require("../controller/VerifyPassword");
const UserDetails = require("../controller/UserDetails");
const LogoutUser = require("../controller/LogoutUser");
const UpdateUserDetails = require("../controller/UpdateUserDetails");
const SearchUser = require("../controller/SearchUser");
const ForgotPassword = require("../controller/ForgotPassword");
const ResetPassword = require("../controller/ResetPassword");

const router = express.Router();

// create user api

router.post("/register", RegisterUser);
// check Verify Email
router.post("/email", VerifyEmail);
// checking user password
router.post("/password", VerifyPassword);

// forgot password
router.post("/forgot-password", ForgotPassword);

// reset password
router.post("/reset-password/:token", ResetPassword);

// login user details
router.get("/user-details", UserDetails);

// logout User
router.get("/logout", LogoutUser);

// Updated User Details
router.post("/update-user", UpdateUserDetails);

// search user
router.post("/search-user", SearchUser);

module.exports = router;
