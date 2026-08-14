const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

const router = express.Router();

// ========================================================
// POST - Submit a new review from property details page
// ========================================================
router.post("/", async (req, res) => {
    try {
        const db = await connectDB();
        const reviewCollection = db.collection("reviews");
        const propertyCollection = db.collection("properties");
        const usersCollection = db.collection("user");
        const { propertyId, name, email, rating, comment } = req.body;

        // 1. Validate required fields--
        if (!propertyId) {
            return res.status(400).json({
                message: "Property ID is required.",
            });
        }

        if (!email) {
            return res.status(400).json({
                message: "User email is required.",
            });
        }

        if (!rating) {
            return res.status(400).json({
                message: "Rating is required.",
            });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                message: "Comment is required.",
            });
        }

        // 2. Validate Property ID--
        if (!ObjectId.isValid(propertyId)) {
            return res.status(400).json({
                message: "Invalid property ID.",
            });
        }
        const propertyObjectId = new ObjectId(propertyId);

        // 3. Check if property exists--
        const property = await propertyCollection.findOne({
            _id: propertyObjectId,
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found.",
            });
        }

        // 4. Find user by email--
        const user = await usersCollection.findOne({
            email: email,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // 5. Check if this user already reviewed this property--
        const existingReview = await reviewCollection.findOne({
            propertyId: propertyObjectId,
            userId: user._id,
        });

        if (existingReview) {
            return res.status(409).json({
                message: "You have already reviewed this property.",
            });
        }

        // 6. Validate rating--
        const numericRating = Number(rating);

        if (numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5.",
            });
        }

        // 7. Create review--
        const newReview = {
            propertyId: propertyObjectId,
            userId: user._id,

            name: name || user.name,
            email: user.email,

            reviewDate: new Date(),

            rating: numericRating,
            comment: comment.trim(),

            createdAt: new Date(),
        };

        // 8. Insert review
        const result = await reviewCollection.insertOne(newReview);

        // 9. Response--
        res.status(201).json({
            message: "Review submitted successfully.",

            review: {
                _id: result.insertedId,
                ...newReview,
            },
        });

    } catch (error) {
        console.error("Create review error:", error);
        // MongoDB duplicate key--
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this property.",
            });
        }
        res.status(500).json({
            message: "Failed to submit review.",
            error: error.message,
        });
    }
});


// ==============================================
// Get all reviews from property details page
// ==============================================
router.get("/:propertyId", async (req, res) => {
    try {
        const db = await connectDB();
        const reviewCollection = db.collection("reviews");
        const { propertyId } = req.params;

        // 1. Validate property ID--
        if (!propertyId) {
            return res.status(400).json({
                message: "Property ID is required.",
            });
        }

        if (!ObjectId.isValid(propertyId)) {
            return res.status(400).json({
                message: "Invalid property ID.",
            });
        }

        // Convert string → MongoDB ObjectId--
        const propertyObjectId = new ObjectId(propertyId);

        // 2. Find reviews--
        const reviews = await reviewCollection
            .find({
                propertyId: propertyObjectId,
            })
            .sort({
                createdAt: -1,
            })
            .toArray();

        // 3. Return reviews--
        res.status(200).json(reviews);

    } catch (error) {
        console.error("Get property reviews error:", error);
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
});

module.exports = router;
