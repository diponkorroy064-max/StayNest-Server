const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Load routes AFTER dotenv---
const adminRoutes = require("./src/routes/admin");
const ownerRoutes = require("./src/routes/owner");
const tenantRoutes = require("./src/routes/tenant");
const propertyRoutes = require("./src/routes/properties");
const reviewRoutes = require("./src/routes/review");
const favouriteRoutes = require("./src/routes/favourites");
const userRoutes = require("./src/routes/users");


// Database--
const connectDB = require("./src/config/db");
const app = express();
const port = process.env.PORT || 8000;


// Middleware--
app.use(cors());
app.use(express.json());


// Routes--
app.use("/api/properties", propertyRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/users", userRoutes);


// Home--
app.get("/", (req, res) => {
  res.send("Hello Diponkor vaya, New StayNest server is running!");
});


// Start server--
async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`StayNest server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server failed:", error);
  }
}

startServer();


















// const express = require('express');
// const app = express()
// require('dotenv').config()
// const port = process.env.PORT
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = process.env.MONGODB_URL;


// const cors = require('cors');
// app.use(cors());
// app.use(express.json());

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// async function run() {
//   try {
//     // await client.connect();
//     const database = client.db("staynest");

//     const propertyCollections = database.collection('properties');
//     const favouritesCollection = database.collection('favourites');
//     const bookingCollection = database.collection('bookings');
//     const reviewCollection = database.collection('review');
//     const usersCollection = database.collection('user');

//     //all properties api------
//     app.post('/api/properties', async (req, res) => {
//       const properties = req.body;
//       // console.log(properties);
//       const result = await propertyCollections.insertOne(properties);
//       // console.log("data committed", result);
//       res.json(result);
//     })

//     app.get('/api/properties', async (req, res) => {
//       const properties = await propertyCollections.find().toArray();
//       res.json(properties);
//     })

//     app.get('/api/properties/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         // console.log("RAW ID:", id);

//         const query = { _id: new ObjectId(id) };
//         const result = await propertyCollections.findOne(query);
//         res.json(result || null);

//       }
//       catch (error) {
//         // console.log("BACKEND ERROR:", error.message);
//         res.status(500).json({
//           message: "Invalid ObjectId or server error"
//         });
//       }
//     });

//     app.get("/properties/byEmail", async (req, res) => {
//       try {
//         const email = req.query.email;

//         if (!email) {
//           return res.status(400).json({
//             message: "Email query is required",
//           });
//         }
//         const query = { ownerEmail: email };
//         const result = await propertyCollections.find(query).toArray();

//         res.status(200).json(result);
//       }
//       catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });

//     app.delete("/api/properties/:id", async(req, res) => {
//       try {
//         const { id } = req.params;
//         // console.log('id from body', id);

//         const query = { _id: new ObjectId(id) };
//         // console.log('query from query', query);

//         const result = await propertyCollections.deleteOne(query);

//         if (result.deletedCount === 0) {
//           return res.status(404).json({
//             message: "Property not found",
//           });
//         }

//         res.status(200).json({
//           message: "Property deleted successfully",
//         });
//       } catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });


//     app.patch("/api/properties/:id", async (req, res) => {
//       try {
//         const { id } = req.params;
//         console.log('id of body request', id);
//         const updatedData = req.body;
//         console.log('updated data', updatedData);

//         const result = await propertyCollections.updateOne(
//           {
//             _id: new ObjectId(id),
//           },
//           {
//             $set: updatedData,
//           }
//         );

//         res.status(200).json({
//           message: "Property updated successfully",
//           result,
//         });
//       } catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });




//     app.get('/api/favourites/byEmail', async (req, res) => {
//       try {
//         const email = req.query.email;

//         if (!email) {
//           return res.status(400).json({
//             message: "Email query is required",
//           });
//         }
//         const query = { currentUserEmail: email };
//         const result = await favouritesCollection.find(query).toArray();
//         res.status(200).json(result);
//       }
//       catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     })

//     app.delete("/api/favourites/:id", async (req, res) => {
//       console.log(req.params.id);

//       try {
//         const { id } = req.params;

//         const result = await favouritesCollection.deleteOne({
//           _id: id,
//         });
//         console.log(result);

//         if (result.deletedCount === 0) {
//           return res.status(404).json({
//             message: "Favourite not found.",
//           });
//         }

//         res.json({
//           message: "Favorite removed successfully.",
//         });
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({
//           message: err.message,
//         });
//       }
//     });


//     // booking api---


//     // users api----
//     app.get("/api/users", async (req, res) => {
//       try {
//         const users = await usersCollection.find().toArray();

//         res.status(200).json(users);
//       } catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });


//     app.get("/users/profile", async (req, res) => {
//       try {
//         const { email } = req.query;

//         if (!email) {
//           return res.status(400).json({
//             message: "Email is required",
//           });
//         }
//         const user = await usersCollection.findOne({ email });

//         if (!user) {
//           return res.status(404).json({
//             message: "User not found",
//           });
//         }

//         res.json(user);
//       } catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });


//     app.patch("/users/profile/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const updatedData = req.body;
//         const result = await usersCollection.updateOne(
//           {
//             _id: new ObjectId(id),
//           },
//           {
//             $set: updatedData,
//           }
//         );
//         res.json(result);
//       }
//       catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });


//     // app.patch("/api/users/:id/role", async (req, res) => {
//     //   try {
//     //     const id = req.params.id;
//     //     const { role } = req.body;

//     //     const result = await usersCollection.updateOne(
//     //       { _id: new ObjectId(id) },
//     //       {
//     //         $set: {
//     //           role,
//     //         },
//     //       }
//     //     );

//     //     res.status(200).json(result);
//     //   } catch (error) {
//     //     res.status(500).json({
//     //       message: error.message,
//     //     });
//     //   }
//     // });


//     // app.delete("/api/users/:id", async (req, res) => {
//     //   try {
//     //     const id = req.params.id;

//     //     const result = await usersCollection.deleteOne({
//     //       _id: new ObjectId(id),
//     //     });

//     //     res.status(200).json(result);
//     //   } catch (error) {
//     //     res.status(500).json({
//     //       message: error.message,
//     //     });
//     //   }
//     // });



//     // analytics api----
//     app.get("/analytics", async(req, res) => {
//       try {
//         const email = req.query.email;
//         const properties = await propertyCollections.find({ ownerEmail: email }).toArray();
//         const propertyIds = properties.map((property) => property._id.toString());
//         // console.log('peoperty ids', propertyIds);

//         const bookings = await bookingCollection.find({ propertyId: { $in: propertyIds } }).toArray();
//         // console.log('bookins', bookings);

//         res.status(200).json(bookings);
//       }
//       catch (error) {
//         res.status(500).json({
//           message: error.message,
//         });
//       }
//     });





//     // Send a ping to confirm a successful connection----
//     // await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   }
//   finally {
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('Hello Diponkor vaya staynest server is running....!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

