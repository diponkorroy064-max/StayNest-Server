const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URL;

if (!uri) {
    throw new Error("MONGODB_URL is not defined in .env");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let database;

async function connectDB() {
    if (database) {
        return database;
    }
    try {
        await client.connect();
        database = client.db("staynest");

        console.log("MongoDB connected successfully");

        return database;
    }
    catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}

module.exports = connectDB;
