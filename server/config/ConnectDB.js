const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to DB");
    });

    connection.on("error", (error) => {
      console.error("Something went wrong", error);
    });
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

module.exports = ConnectDB;
