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

  // Production frontend URL
  // Will be configured when deployed to AWS
  process.env.FRONTEND_URL,
].filter(Boolean);

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests or API tools
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS policy does not allow origin: ${origin}`
        )
      );
    },

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