const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");
const router = express.Router();
const authenticate = require("../middleware/authenticate");


//====================================================
// Get favourites by email in tenant dashboard-->home
//====================================================
router.get("/favourites", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("favourites");
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const favourites = await collection
            .find({
                currentUserEmail: email,
            })
            .toArray();

        res.status(200).json(favourites);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


//===========================================================
// Remove favourite from tenant dashboard--->favourites
//===========================================================
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("favourites");
        const { id } = req.params;
        const result = await collection.deleteOne({
            _id: id,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Favourite not found",
            });
        }

        res.status(200).json({
            message: "Favourite removed successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});



//=======================================================================
// Create bookings by tenant in booking detail page--->Booking Modal
//=======================================================================
router.post("/bookings", authenticate, async (req, res) => {
    try {
        const db = await connectDB();
        const bookingCollection = db.collection("bookings");
        const booking = req.body;
        const { propertyId, tenantEmail, moveInDate, contactNumber} = booking;

        // Validate required fields---
        if (!propertyId) {
            return res.status(400).json({
                message: "Property ID is required.",
            });
        }

        if (!tenantEmail) {
            return res.status(400).json({
                message: "Tenant email is required.",
            });
        }

        if (!moveInDate) {
            return res.status(400).json({
                message: "Move-in date is required.",
            });
        }

        if (!contactNumber) {
            return res.status(400).json({
                message: "Contact number is required.",
            });
        }

        // Check existing active booking---
        console.log("Checking property:", propertyId);

        const existingBooking = await bookingCollection.findOne({
            propertyId: propertyId,
            bookingStatus: {
                $in: ["Confirmed", "Active"],
            },
        });
        // console.log("Existing booking:", existingBooking);

        // Create booking---
        const newBooking = {
            ...booking,
            payAmount: Number(booking.payAmount),
            createdAt: new Date(),
        };

        const result = await bookingCollection.insertOne(newBooking);

        return res.status(201).json({
            message: "Booking created successfully.",
            booking: {
                ...newBooking,
                _id: result.insertedId,
            },
        });

    } catch (error) {
        console.error("Booking error:", error);

        return res.status(500).json({
            message: "Failed to create booking.",
            error: error.message,
        });
    }
});


//============================================================
// Get tenant bookings by email in tenant dashboard--->home
//============================================================
router.get("/bookings", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("bookings");
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const bookings = await collection
            .find({
                tenantEmail: email,
            })
            .toArray();

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


module.exports = router;

