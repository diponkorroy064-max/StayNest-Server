const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const adminRoutes = require("./src/routes/admin");
const ownerRoutes = require("./src/routes/owner");
const tenantRoutes = require("./src/routes/tenant");
const propertyRoutes = require("./src/routes/properties");
const reviewRoutes = require("./src/routes/review");
const favouriteRoutes = require("./src/routes/favourites");
const userRoutes = require("./src/routes/users");

const connectDB = require("./src/config/db");

const app = express();

// ========================================
// CORS
// ========================================

const allowedOrigins = [
  "http://localhost:3000",
  "https://staynest-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// ========================================
// DATABASE
// ========================================

let dbConnected = false;

async function ensureDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
    console.log("MongoDB connected successfully");
  }
}

// ========================================
// DATABASE MIDDLEWARE
// ========================================

app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StayNest server is running!",
  });
});

// ========================================
// JWKS TEST
// ========================================

app.get("/test-jwks", async (req, res) => {
  try {
    const authUrl = process.env.BETTER_AUTH_URL;

    if (!authUrl) {
      return res.status(500).json({
        success: false,
        message: "BETTER_AUTH_URL is not configured",
      });
    }

    const jwksUrl = `${authUrl}/api/auth/jwks`;

    console.log("JWKS URL:", jwksUrl);

    const response = await fetch(jwksUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `JWKS request failed with status ${response.status}`,
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("JWKS FETCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========================================
// ROUTES
// ========================================

app.use("/api/properties", propertyRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/users", userRoutes);

// ========================================
// EXPORT
// ========================================

module.exports = app;
