const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");
const { logger } = require("../middleware/auth.middleware");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

// ====================================================
// ADMIN ANALYTICS IN ADMIN DASHBOARD--->dashboard
// ====================================================
router.get("/analytics", async (req, res) => {
    try {
        const db = await connectDB();

        const usersCollection = db.collection("user");
        const propertiesCollection = db.collection("properties");
        const bookingsCollection = db.collection("bookings");

        const totalUsers = await usersCollection.countDocuments();
        const totalProperties = await propertiesCollection.countDocuments();
        const totalBookings = await bookingsCollection.countDocuments();
        const approvedProperties = await propertiesCollection.countDocuments({ status: "Approved" });
        const pendingProperties = await propertiesCollection.countDocuments({ status: "Pending" });
        const paidBookings = await bookingsCollection.find({ paymentStatus: "Paid" }).toArray();
        const totalRevenue = paidBookings.reduce((sum, booking) => sum + Number(booking.payAmount || booking.rentAmount || 0), 0);
        const recentBookings = await bookingsCollection.find().sort({ bookingDate: -1 }).limit(3).toArray();
        const recentUsers = await usersCollection.find().sort({ createdAt: 1 }).limit(3).toArray();

        // console.log("Total Users:", totalUsers);
        // console.log("Total Properties:", totalProperties);
        // console.log("Total Bookings:", totalBookings);
        // console.log("Approved Properties:", approvedProperties);
        // console.log("Pending Properties:", pendingProperties);
        // console.log("Total Revenue:", totalRevenue);
        // console.log("Recent Bookings:", recentBookings);
        // console.log("Recent Users:", recentUsers);

        res.json({ totalUsers, totalProperties, totalBookings, totalRevenue, approvedProperties, pendingProperties, recentBookings, recentUsers });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// =================================================
// *** GET ALL USERS IN ADMIN DASHBOARD ---> users
// =================================================
router.get("/users", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("user");
        const users = await collection.find().toArray();
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// ==================================================
// CHANGE USER ROLE IN ADMIN DASHBOARD---> users
// ==================================================
router.patch("/users/:id/role", authenticate, async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("user");
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                message: "Role is required",
            });
        }

        const result = await collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    role,
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "User role updated successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// ============================================
// DELETE USER IN ADMIN DASHBOARD--->users
// ============================================
router.delete("/users/:id", authenticate, async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("user");
        const { id } = req.params;
        const result = await collection.deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// ======================================================
// GET ALL PROPERTIES IN ADMIN DASHBOARD-->Properties
// ======================================================
router.get("/properties", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");
        const properties = await collection.find().toArray();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


//============================================================
// UPDATE PROPERTY STATUS IN ADMIN DASHBOARD-->Properties
//============================================================
router.patch("/properties/:id/status", authenticate, async (req, res,) => {
    try {
        const db = await connectDB();
        const collection = db.collection("properties");

        const { id } = req.params;
        const { status, rejectionFeedback } = req.body;

        // Only these two statuses are allowed--
        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be either Approved or Rejected",
            });
        }

        // Validate MongoDB ObjectId--
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid property ID",
            });
        };
        const updateData = { status };

        // Save rejection feedback only when rejected--
        if (status === "Rejected") {
            updateData.rejectionFeedback = rejectionFeedback || "";
        }

        // Optional: remove old rejection feedback when approving--
        if (status === "Approved") {
            updateData.rejectionFeedback = "";
        }

        const result = await collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: updateData,
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        res.status(200).json({
            message: `Property ${status} successfully`,
            status,
            rejectionFeedback: status === "Rejected" ? rejectionFeedback || "" : "",
        });
    } catch (error) {
        console.error("Property status update error:", error);
        res.status(500).json({
            message: "Failed to update property status",
            error: error.message,
        });
    }
});


// =====================================================
// DELETE PROPERTY IN ADMIN DASHBOARD--->Properties
// =====================================================
router.delete("/properties/:id", authenticate, async (req, res) => {
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


// =============================================================
// GET ALL BOOKINGS DATA IN ADMIN DASHBOARD ---> BOOKINGS
// =============================================================
router.get("/bookings", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("bookings");
        const bookings = await collection.find().toArray();

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});



// ================================================================
// ADMIN - UPDATE BOOKING STATUS IN ADMIN DASHBOARD-->Bookings
// ================================================================
router.patch("/properties/:id/booking-status", authenticate, async (req, res) => {
    try {
        const db = await connectDB();
        const propertiesCollection = db.collection("properties");

        const { id } = req.params;
        const { bookingStatus } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Property ID is required",
            });
        }

        if (!bookingStatus) {
            return res.status(400).json({
                message: "Booking status is required",
            });
        }

        if (!["Booked", "Available"].includes(bookingStatus)) {
            return res.status(400).json({
                message: "Invalid booking status",
            });
        }

        const result = await propertiesCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    bookingStatus,
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        res.status(200).json({
            message: `Property marked as ${bookingStatus}`,
            bookingStatus,
        });

    } catch (error) {
        console.error("Update property booking status:", error);

        res.status(500).json({
            message: error.message,
        });
    }
});


module.exports = router;
