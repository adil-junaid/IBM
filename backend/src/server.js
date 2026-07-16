const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import Upload Routes
const uploadRoutes = require("./routes/upload.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "AI Research Assistant Backend is Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});