const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/ConnectDB");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const { app, server } = require("./socket/index");

// const app = express();

// Ensure the FRONTEND_URL has no trailing slash
const frontendURL = process.env.FRONTEND_URL.replace(/\/$/, "");

app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.options("*", cors()); // Handle preflight requests for all routes

app.get("/", (req, res) => {
  res.json({
    message: "Home Page!",
  });
});

// API endpoints
app.use("/api", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
