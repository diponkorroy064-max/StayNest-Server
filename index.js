const express = require("express");
const cors = require("cors");
require("dotenv").config();


// Load routes AFTER dotenv
const adminRoutes = require("./src/routes/admin");
const ownerRoutes = require("./src/routes/owner");
const tenantRoutes = require("./src/routes/tenant");
const propertyRoutes = require("./src/routes/properties");
const reviewRoutes = require("./src/routes/review");
const favouriteRoutes = require("./src/routes/favourites");
const userRoutes = require("./src/routes/users");


// Database
const connectDB = require("./src/config/db");

const app = express();
const port = process.env.PORT || 8000;


// Middleware
app.use(cors());
app.use(express.json());


// =====================================================
// TEST BETTER AUTH JWKS CONNECTION
// =====================================================
const AUTH_URL = process.env.BETTER_AUTH_URI;
const JWKS_URL = `${AUTH_URL}/api/auth/jwks`;

console.log("AUTH URL:", AUTH_URL);
console.log("JWKS URL:", JWKS_URL);


app.get("/test-jwks", async (req, res) => {
  try {
    console.log("Testing Better Auth JWKS...");

    const response = await fetch(JWKS_URL);

    console.log("JWKS status:", response.status);

    if (!response.ok) {
      throw new Error(
        `JWKS request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    console.log("JWKS received successfully");

    res.json(data);

  } catch (error) {
    console.error("JWKS FETCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// =====================================================
// APPLICATION ROUTES
// =====================================================

app.use("/api/properties", propertyRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/users", userRoutes);


// Home
app.get("/", (req, res) => {
  res.send("Hello Diponkor vaya, StayNest server is running!");
});


// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(
        `StayNest server running on port ${port}`
      );
    });

  } catch (error) {
    console.error("Server failed:", error);
  }
}

startServer();
