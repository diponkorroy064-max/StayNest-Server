const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes Import---
const adminRoutes = require("../routes/admin");
const ownerRoutes = require("../routes/owner");
const tenantRoutes = require("../routes/tenant");
const propertyRoutes = require("../routes/properties");
const reviewRoutes = require("../routes/review");
const favouriteRoutes = require("../routes/favourites");
const userRoutes = require("../routes/users");

const app = express();

// ========================================
// CORS Configuration
// ========================================
const allowedOrigins = [
  "http://localhost:3000",
  "https://staynest-vert-beta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)---
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

// Base Home Route
app.get("/", (req, res) => {
  res.send("StayNest Server is running successfully!");
});

// JWKS TEST Route
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// Application API Routes---
app.use("/api/properties", propertyRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
