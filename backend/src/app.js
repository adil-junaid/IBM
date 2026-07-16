const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/upload.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Research Assistant Backend is Running 🚀",
  });
});

// API Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;