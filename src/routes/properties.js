const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");
const router = express.Router();


// GET all properties in all-properties page--->
router.get("/", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");

        const properties = await collection
            .find({
                status: "Approved",
                bookingStatus: { $ne: "Booked" }
            }).toArray();

        res.status(200).json(properties);
    } catch (error) {
        console.error("Get approved properties error:", error);
        res.status(500).json({
            message: error.message,
        });
    }
});



// Get recently added properties in RecentlyAddedProperties--->
router.get("/recently-added", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");

        const properties = await collection
            .find({})
            .sort({ _id: -1 })
            .limit(4)
            .toArray();

        res.status(200).json(properties);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// GET property by ID in property details page--->
router.get("/:id", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");

        const { id } = req.params;

        const property = await collection.findOne({
            _id: new ObjectId(id),
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        res.status(200).json(property);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
module.exports = router;

