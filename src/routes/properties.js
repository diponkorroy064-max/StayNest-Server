const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

const router = express.Router();

// GET all properties---
router.get("/", async (req, res) => {
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


// GET property by ID---
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


// CREATE property---
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


// UPDATE property---
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


// DELETE property---
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

module.exports = router;
