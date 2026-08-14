const express = require("express");
const connectDB = require("../config/db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// ==========================================
// ADD PROPERTY TO FAVOURITES LIST
// ==========================================
router.post("/", authenticate, async (req, res) => {
    try {
        const db = await connectDB();
        const favouritesCollection = db.collection("favourites");
        const {propertyId, currentUserEmail} = req.body;

        // Validate property ID---
        if (!propertyId) {
            return res.status(400).json({
                message: "Property ID is required.",
            });
        }

        // Validate user email---
        if (!currentUserEmail) {
            return res.status(400).json({
                message: "User email is required.",
            });
        }

        // Check if this user already favourited this property---
        const existingFavourite = await favouritesCollection.findOne({ propertyId, currentUserEmail});

        if (existingFavourite) {
            return res.status(409).json({message: "You have already added this property to your favourites."});
        }

        // Create favourite document---
        const favourite = {
            ...req.body,
            propertyId,
            currentUserEmail,
            createdAt: new Date(),
        };

        // Let MongoDB generate a NEW _id---
        delete favourite._id;

        const result = await favouritesCollection.insertOne(favourite);

        return res.status(201).json({
            message: "Property added to favourites successfully.",
            favourite: {
                ...favourite,
                _id: result.insertedId,
            },
        });

    } catch (error) {
        console.error("Add favourite error:", error);

        // MongoDB unique index protection
        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "You have already added this property to your favourites.",
            });
        }

        return res.status(500).json({
            message: "Failed to add property to favourites.",
            error: error.message,
        });
    }
});

module.exports = router;
