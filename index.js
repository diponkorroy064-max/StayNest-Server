const express = require("express");
const cors = require("cors");
require("dotenv").config();


// Load routes AFTER dotenv---
const adminRoutes = require("./src/routes/admin");
const ownerRoutes = require("./src/routes/owner");
const tenantRoutes = require("./src/routes/tenant");
const propertyRoutes = require("./src/routes/properties");
const reviewRoutes = require("./src/routes/review");
const favouriteRoutes = require("./src/routes/favourites");
const userRoutes = require("./src/routes/users");


// Database---
const connectDB = require("./src/config/db");
const app = express();
const port = process.env.PORT || 8000;


// Middleware---
app.use(cors());
app.use(express.json());

// Routes---
app.use("/api/properties", propertyRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/users", userRoutes);


// Home---
app.get("/", (req, res) => {
  res.send("Hello Diponkor vaya, New StayNest server is running!");
});


// Start server---
async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`StayNest server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server failed:", error);
  }
}

startServer();


