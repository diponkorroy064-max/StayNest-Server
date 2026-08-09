const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

const router = express.Router();


// =============================
// FAVOURITES
// =============================

// Add favourite
router.post("/favourites", async (req, res) => {
    try {
        const db = await connectDB();

        const collection = db.collection("favourites");

        const favourite = req.body;

        const result = await collection.insertOne(favourite);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// Get favourites by email
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


// Delete favourite
router.delete("/favourites/:id", async (req, res) => {
    try {
        const db = await connectDB();

        const collection = db.collection("favourites");

        const { id } = req.params;

        const result = await collection.deleteOne({
            _id: new ObjectId(id),
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


// =============================
// BOOKINGS
// =============================

// Create booking
router.post("/bookings", async (req, res) => {
    try {
        const db = await connectDB();

        const collection = db.collection("bookings");

        const booking = req.body;

        const result = await collection.insertOne(booking);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// Get tenant bookings
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



//     app.get("/bookings", async (req, res) => {
//       try {
//         const bookings = await bookingCollection.find().toArray();

//         res.json(bookings);
//       } catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });


//     app.post('/api/bookings', async (req, res) => {
//       try {
//         const bookings = req.body;
//         // console.log(bookings);

//         // const exists = await bookingCollection.findOne({
//         //   propertyId: bookings.propertyId,
//         // });

//         // if (exists) {
//         //   return res.status(409).json({
//         //     message: "Property already exists in booking list.",
//         //   });
//         // }

//         const result = await bookingCollection.insertOne(bookings);
//         res.status(201).json(result);
//       }
//       catch (err) {
//         res.status(500).json({ message: err.message })
//       }
//     })


module.exports = router;
