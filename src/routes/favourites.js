const express = require("express");
const connectDB = require("../config/db");

const router = express.Router();

// ==========================================
// ADD PROPERTY TO FAVOURITES LIST
// ==========================================
router.post("/", async (req, res) => {
    try {
        const db = await connectDB();
        const favouritesCollection = db.collection("favourites");
        const favourite = req.body;
        const { propertyId, currentUserEmail} = favourite;

        // Validate required fields--
        if (!propertyId) {
            return res.status(400).json({
                message: "Property ID is required.",
            });
        }
        if (!currentUserEmail) {
            return res.status(400).json({
                message: "User email is required.",
            });
        }

        // Check if property already exists for this user--
        const existingFavourite =
            await favouritesCollection.findOne({
                propertyId: propertyId,
                currentUserEmail: currentUserEmail,
            });

        if (existingFavourite) {
            return res.status(409).json({
                message: "Property already exists in your favourites.",
            });
        }

        // Insert EXACT frontend object--
        const result = await favouritesCollection.insertOne(favourite);

        // Response--
        res.status(201).json({
            message: "Property added to favourites successfully.",
            favourite: {
                ...favourite,
                _id: result.insertedId,
            },
        });

    }
    catch (error) {
        console.error("Add favourite error:", error);

        // Duplicate key protection--
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Property already exists in your favourites.",
            });
        }

        res.status(500).json({
            message: "Failed to add property to favourites.",
            error: error.message,
        });
    }
});

module.exports = router;
