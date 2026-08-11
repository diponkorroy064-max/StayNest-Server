const express = require("express");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");
const router = express.Router();


// Owner analytics in owner dashboard-->home
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

        const properties = await propertiesCollection.find({ ownerEmail: email, }).toArray();
        const propertyIds = properties.map((property) => property._id.toString());
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


// Get Owner properties in owner dashboard--->My Property
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



// Create property in owner dashboard--->Add Property
router.post("/", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");

        const property = req.body;

        const result = await collection.insertOne(property);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});



// Update property in owner dashboard--->My Property
router.patch("/:id", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");

        const { id } = req.params;
        const updatedData = req.body;
        const result = await collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: updatedData,
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        res.status(200).json({
            message: "Property updated successfully",
            result,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// Delete property in owner dashboard--->My Property
router.delete("/:id", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");

        const { id } = req.params;

        const result = await collection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        res.status(200).json({
            message: "Property deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});



//     app.get('/bookings/byEmail', async (req, res) => {
//       try {
//         const email = req.query.email;

//         if (!email) {
//           return res.status(400).json({ message: "Tenant lookup email target parameters required." });
//         }

//         const query = { tenantEmail: email };
//         const result = await bookingCollection.find(query).toArray();

//         res.status(200).json(result);
//       }
//       catch (error) {
//         res.status(500).json({ message: error.message });
//       }
//     });



// update booking status in owner dashboard--->Booking Request
router.patch("/:id/bookingStatus", async (req, res) => {
    try {
        const db = await connectDB();
        const bookingCollection = db.collection("bookings");

        const { id } = req.params;
        const { bookingStatus } = req.body;

        if (!bookingStatus) {
            return res.status(400).json({
                message: "bookingStatus is required",
            });
        }

        const result = await bookingCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    bookingStatus,
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        res.status(200).json({
            message: `Booking ${bookingStatus} successfully`,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
















module.exports = router;
