const express = require("express");
const cors = require("cors");

const {
  clerkMiddleware,
} = require("@clerk/express");

// ========================================
// IMPORT ROUTES
// ========================================

const uploadRoutes = require(
  "./routes/upload.routes"
);

const chatRoutes = require(
  "./routes/chat.routes"
);

const documentRoutes = require(
  "./routes/document.routes"
);

const historyRoutes = require(
  "./routes/history.routes"
);

const conversationRoutes = require(
  "./routes/conversation.routes"
);

// ========================================
// CREATE EXPRESS APP
// ========================================

const app = express();

// ========================================
// CORS
// ========================================

const allowedOrigins = [
  // Local Vite development
  "http://localhost:5173",
  "http://localhost:5174",

  // Local Docker frontend
  "http://localhost:3000",

  // Old Vercel domain
  "https://ibm-peach.vercel.app",

  // Current production frontend
  "https://ibm-ai-research-assistant.vercel.app",

  // Optional frontend URL
  process.env.FRONTEND_URL,
].filter(Boolean);

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

// ========================================
// REQUEST BODY PARSING
// ========================================

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// CLERK AUTHENTICATION MIDDLEWARE
//
// This verifies Clerk session tokens and
// makes authentication data available to
// requireAuthentication middleware.
//
// Individual routes still decide whether
// authentication is required.
// ========================================

app.use(
  clerkMiddleware()
);

// ========================================
// PUBLIC HEALTH CHECK
//
// This remains public so Render can
// check whether the backend is running.
// ========================================

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,

      message:
        "AI Research Assistant Backend is Running 🚀",
    });
  }
);

// ========================================
// API ROUTES
// ========================================

// Protected inside upload.routes.js
app.use(
  "/api/upload",
  uploadRoutes
);

// Authentication will be added next
app.use(
  "/api/chat",
  chatRoutes
);

// Authentication will be added next
app.use(
  "/api/documents",
  documentRoutes
);

// Authentication will be added next
app.use(
  "/api/history",
  historyRoutes
);

// Authentication will be added next
app.use(
  "/api/conversations",
  conversationRoutes
);

// ========================================
// 404 HANDLER
// ========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,

      message:
        "Route not found.",
    });
  }
);

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Global error:",
      error
    );

    res
      .status(
        error.status ||
          500
      )
      .json({
        success: false,

        message:
          error.message ||
          "Internal server error.",
      });
  }
);

// ========================================
// EXPORT EXPRESS APP
// ========================================

module.exports = app;