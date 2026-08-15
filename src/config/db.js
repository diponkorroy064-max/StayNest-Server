const { MongoClient, ServerApiVersion } = require("mongodb");
let client;
let database;

async function connectDB() {
    if (database) {
        return database;
    }

    const uri = process.env.MONGODB_URL;

    if (!uri) {
        console.error("MONGODB_URL Environment Variable is missing!");
        throw new Error("MONGODB_URL is missing in environment variables.");
    }

    try {
        if (!client) {
            client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });
            await client.connect();
        }

        database = client.db("staynest");
        console.log("MongoDB connected successfully");
        return database;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
}

module.exports = connectDB;
