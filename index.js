require("dotenv").config();
const app = require("./app");
module.exports = app;
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`StayNest server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server failed:", error);
        process.exit(1);
    }
}

startServer();
