const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");
const authenticate = require("../middleware/authenticate");
const router = express.Router();


// ==========================================
// GET SINGLE USER PROFILE BY EMAIL
// ==========================================
router.get("/profile", async (req, res) => {
    try {
        const db = await connectDB();
        const usersCollection = db.collection("user");

        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await usersCollection.findOne({
            email: email,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Get user profile error:", error);

        res.status(500).json({
            message: "Failed to load profile",
            error: error.message,
        });
    }
});


// ==========================================
// UPDATE USER PROFILE in Dashboard---
// ==========================================
router.patch("/profile/:id", authenticate, async (req, res) => {
    try {
        const db = await connectDB();
        const usersCollection = db.collection("user");

        const { id } = req.params;
        const updateData = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID",
            });
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No data provided for update",
            });
        }

        // Fields that are allowed to be updated
        const allowedFields = [
            "name",
            "image",
            "phone",
            "nid",
            "emergencyContact",
            "permanentAddress",
            "companyName",
            "bkashNumber",
            "bankAccountNumber",
        ];

        const filteredData = {};

        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        });

        if (Object.keys(filteredData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
            });
        }

        filteredData.updatedAt = new Date();
        const result = await usersCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: filteredData,
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const updatedUser = await usersCollection.findOne({
            _id: new ObjectId(id),
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Update user profile error:", error);

        res.status(500).json({
            message: "Failed to update profile",
            error: error.message,
        });
    }
});

module.exports = router;
