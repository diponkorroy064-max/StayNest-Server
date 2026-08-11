const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");
const router = express.Router();


// ===========================================================
// Add favourite property in tenant dashboard-->favourite
// ===========================================================
// router.post("/favourites", async (req, res) => {
//     try {
//         const db = await connectDB();
//         const collection = db.collection("favourites");
//         const favourite = req.body;

//         const result = await collection.insertOne(favourite);

//         res.status(201).json(result);

//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// });

//     // Favourites api---
//     app.post('/api/favourites', async (req, res) => {
//       try {
//         const favourites = req.body;
//         // console.log(favourites);

//         // const exists = await favouritesCollection.findOne({
//         //   propertyId: favourites.propertyId,
//         // });

//         // if (exists) {
//         //   return res.status(409).json({
//         //     message: "Property already exists in your favourites.",
//         //   });
//         // }

//         const result = await favouritesCollection.insertOne(favourites);
//         res.status(201).json(result);
//       }
//       catch (err) {
//         res.status(500).json({ message: err.message })
//       }
//     })



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
router.delete("/:id", async (req, res) => {
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



// =============================
// Create bookings
// =============================
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
