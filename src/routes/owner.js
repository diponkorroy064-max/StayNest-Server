const express = require("express");
const connectDB = require("../config/db");

const router = express.Router();


// Owner properties
router.get("/properties", async (req, res) => {
    try {
        const db = await connectDB();

        const propertiesCollection = db.collection("properties");

        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Owner email is required",
            });
        }

        const properties = await propertiesCollection
            .find({
                ownerEmail: email,
            })
            .toArray();

        res.status(200).json(properties);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// Owner analytics
router.get("/analytics", async (req, res) => {
    try {
        const db = await connectDB();

        const propertiesCollection = db.collection("properties");
        const bookingsCollection = db.collection("bookings");

        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Owner email is required",
            });
        }

        const properties = await propertiesCollection
            .find({
                ownerEmail: email,
            })
            .toArray();

        const propertyIds = properties.map((property) =>
            property._id.toString()
        );

        const bookings = await bookingsCollection
            .find({
                propertyId: {
                    $in: propertyIds,
                },
            })
            .toArray();

        res.status(200).json({
            properties,
            bookings,
            totalProperties: properties.length,
            totalBookings: bookings.length,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


module.exports = router;
