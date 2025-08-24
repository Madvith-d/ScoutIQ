// server.js - Fixed version
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route (simple test)
app.get("/", (req, res) => {
  res.json({ 
    status: "Server is running!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Resume Analyzer API is healthy"
  });
});

// Import routes AFTER app is defined
let resumeRoutes, authRoutes;

try {
  // Dynamic imports to catch any import errors
  const resumeModule = await import("./src/routes/resumeRoutes.js");
  const authModule = await import("./src/routes/authRoutes.js");
  
  resumeRoutes = resumeModule.default;
  authRoutes = authModule.default;
  
  // Apply routes
  app.use("/api/auth", authRoutes);
  app.use("/api/resume", resumeRoutes);
  
  console.log("✅ Routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading routes:", error.message);
  console.log("🚀 Starting server without routes for debugging...");
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler - IMPORTANT: This must be a simple string, not a pattern
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Base URL: http://localhost:${PORT}`);
});