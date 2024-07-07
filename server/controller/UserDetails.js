const GetUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function UserDetails(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await GetUserDetailsFromToken(token);
    return res.status(200).json({
      message: "user details",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = UserDetails;
