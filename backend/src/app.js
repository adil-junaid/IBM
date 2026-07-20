const express = require("express");
const cors = require("cors");

// Import Routes
const uploadRoutes = require("./routes/upload.routes");
const chatRoutes = require("./routes/chat.routes");
const documentRoutes = require("./routes/document.routes");
const historyRoutes = require("./routes/history.routes");
const conversationRoutes = require(
  "./routes/conversation.routes"
);

// Create Express App
const app = express();

// ==============================
// MIDDLEWARE
// ==============================

// Allowed frontend origins
const allowedOrigins = [
  // Local Vite development
  "http://localhost:5173",

  // Local Docker frontend
  "http://localhost:3000",

  // Old Vercel domain
  // Keep temporarily because it redirects
  "https://ibm-peach.vercel.app",

  // Current production frontend
  "https://ibm-ai-research-assistant.vercel.app",

  // Optional frontend URL from environment variable
  process.env.FRONTEND_URL,
].filter(Boolean);

// Enable CORS
app.use(
  cors({
    origin: allowedOrigins,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==============================
// HEALTH CHECK
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AI Research Assistant Backend is Running 🚀",
  });
});

// ==============================
// API ROUTES
// ==============================

// Document Upload
app.use(
  "/api/upload",
  uploadRoutes
);

// AI Chat
app.use(
  "/api/chat",
  chatRoutes
);

// Documents
app.use(
  "/api/documents",
  documentRoutes
);

// Chat History
app.use(
  "/api/history",
  historyRoutes
);

// Conversations
app.use(
  "/api/conversations",
  conversationRoutes
);

// ==============================
// 404 HANDLER
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================

app.use(
  (error, req, res, next) => {
    console.error(
      "Global error:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Internal server error.",
    });
  }
);

// Export Express App
module.exports = app;