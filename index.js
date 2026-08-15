require("dotenv").config();
const app = require("./src/api/app");
const connectDB = require("./src/config/db");


//***DB Connection Middleware for Serverless Execution---
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB Connection Failure during request:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});


//***Runs app.listen ONLY during Local Development---
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`StayNest server running on http://localhost:${PORT}`);
    });
}


//***Export app module for Vercel---
module.exports = app;

