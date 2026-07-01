const express = require('express');
const app = express()
require('dotenv').config()
const port = process.env.PORT
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URL;


const cors = require('cors');
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // await client.connect();
    const database = client.db("staynest");

    const propertyCollections = database.collection('properties');
    const favouritesCollection = database.collection('favourites');
    const bookingCollection = database.collection('bookings');
    const reviewCollection = database.collection('review');
    const usersCollection = database.collection('user');

    //all properties api------
    app.post('/api/properties', async (req, res) => {
      const properties = req.body;
      // console.log(properties);
      const result = await propertyCollections.insertOne(properties);
      // console.log("data committed", result);
      res.json(result);
    })

    app.get('/api/properties', async (req, res) => {
      const properties = await propertyCollections.find().toArray();
      res.json(properties);
    })

    app.get('/api/properties/:id', async (req, res) => {
      try {
        const id = req.params.id;
        // console.log("RAW ID:", id);

        const query = { _id: new ObjectId(id) };
        const result = await propertyCollections.findOne(query);
        res.json(result || null);

      }
      catch (error) {
        // console.log("BACKEND ERROR:", error.message);
        res.status(500).json({
          message: "Invalid ObjectId or server error"
        });
      }
    });

    app.get("/properties/byEmail", async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({
            message: "Email query is required",
          });
        }
        const query = { ownerEmail: email };
        const result = await propertyCollections.find(query).toArray();

        res.status(200).json(result);
      }
      catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });

    app.delete("/api/properties/:id", async(req, res) => {
      try {
        const { id } = req.params;
        // console.log('id from body', id);

        const query = { _id: new ObjectId(id) };
        // console.log('query from query', query);

        const result = await propertyCollections.deleteOne(query);

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


    app.patch("/api/properties/:id", async (req, res) => {
      try {
        const { id } = req.params;
        console.log('id of body request', id);
        const updatedData = req.body;
        console.log('updated data', updatedData);

        const result = await propertyCollections.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: updatedData,
          }
        );

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


    // Favourites api---
    app.post('/api/favourites', async (req, res) => {
      try {
        const favourites = req.body;
        // console.log(favourites);
        const exists = await favouritesCollection.findOne({
          propertyId: favourites.propertyId,
        });

        if (exists) {
          return res.status(409).json({
            message: "Property already exists in your favourites.",
          });
        }

        const result = await favouritesCollection.insertOne(favourites);
        res.status(201).json(result);
      }
      catch (err) {
        res.status(500).json({ message: err.message })
      }
    })

    app.get('/api/favourites/byEmail', async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({
            message: "Email query is required",
          });
        }
        const query = { currentUserEmail: email };
        const result = await favouritesCollection.find(query).toArray();
        res.status(200).json(result);
      }
      catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    })

    app.delete("/api/favourites/:id", async (req, res) => {
      console.log(req.params.id);

      try {
        const { id } = req.params;

        const result = await favouritesCollection.deleteOne({
          _id: id,
        });
        console.log(result);

        if (result.deletedCount === 0) {
          return res.status(404).json({
            message: "Favourite not found.",
          });
        }

        res.json({
          message: "Favorite removed successfully.",
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: err.message,
        });
      }
    });


    // booking api---
    app.get("/bookings", async (req, res) => {
      try {
        const bookings = await bookingCollection.find().toArray();

        res.json(bookings);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });


    app.post('/api/bookings', async (req, res) => {
      try {
        const bookings = req.body;
        // console.log(bookings);

        // const exists = await bookingCollection.findOne({
        //   propertyId: bookings.propertyId,
        // });

        // if (exists) {
        //   return res.status(409).json({
        //     message: "Property already exists in booking list.",
        //   });
        // }

        const result = await bookingCollection.insertOne(bookings);
        res.status(201).json(result);
      }
      catch (err) {
        res.status(500).json({ message: err.message })
      }
    })


    app.get('/bookings/byEmail', async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({ message: "Tenant lookup email target parameters required." });
        }

        const query = { tenantEmail: email };
        const result = await bookingCollection.find(query).toArray();

        res.status(200).json(result);
      }
      catch (error) {
        res.status(500).json({ message: error.message });
      }
    });


    app.patch("/api/bookings/:id", async (req, res) => {
      try {
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


    // reveiew api---
    app.post('/api/review', async (req, res) => {
      try {
        const review = req.body;
        // console.log("review from thr body", review);

        // const exists = await reviewCollection.findOne({
        //   email: review.email,
        // });
        // if (exists) {
        //   return res.status(409).json({
        //     message: "Review already exists.",
        //   });
        // }

        const result = await reviewCollection.insertOne(review);
        res.status(201).json(result);
      }
      catch (err) {
        res.status(500).json({ message: err.message })
      }
    })

    app.get('/api/review/:propertyId', async (req, res) => {
      try {
        const propertyId = req.params.propertyId;

        const result = await reviewCollection.find({ propertyId }).toArray();
        res.status(200).json(result);
      }
      catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });


    // users api----
    app.get("/api/users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();

        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });


    app.get("/users/profile", async (req, res) => {
      try {
        const { email } = req.query;

        if (!email) {
          return res.status(400).json({
            message: "Email is required",
          });
        }
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.send(user);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });


    app.patch("/users/profile/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await usersCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: updatedData,
          }
        );
        res.send(result);
      }
      catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });


    // app.patch("/api/users/:id/role", async (req, res) => {
    //   try {
    //     const id = req.params.id;
    //     const { role } = req.body;

    //     const result = await usersCollection.updateOne(
    //       { _id: new ObjectId(id) },
    //       {
    //         $set: {
    //           role,
    //         },
    //       }
    //     );

    //     res.status(200).json(result);
    //   } catch (error) {
    //     res.status(500).json({
    //       message: error.message,
    //     });
    //   }
    // });


    // app.delete("/api/users/:id", async (req, res) => {
    //   try {
    //     const id = req.params.id;

    //     const result = await usersCollection.deleteOne({
    //       _id: new ObjectId(id),
    //     });

    //     res.status(200).json(result);
    //   } catch (error) {
    //     res.status(500).json({
    //       message: error.message,
    //     });
    //   }
    // });


    // ============================================
    // TENANT HISTORICAL LOGS ROUTE SYSTEM
    // ============================================
    // app.get('/api/history/byEmail', async (req, res) => {
    //   try {
    //     const email = req.query.email;

    //     if (!email) {
    //       return res.status(400).json({ message: "Lookup query parameters required." });
    //     }

    //     const bookingsCollection = client.db("staynest").collection('bookings');

    //     // Looks up all historical logs for this user that are not currently active
    //     const query = {
    //       tenantEmail: email,
    //       bookingStatus: { $in: ["Completed", "Cancelled", "CheckedOut", "Rejected"] }
    //     };

    //     const result = await bookingsCollection.find(query).sort({ bookingDate: -1 }).toArray();

    //     res.status(200).json(result);
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    // });


    // analytics api---
    app.get("/analytics", async(req, res) => {
      try {
        const email = req.query.email;
        const properties = await propertyCollections.find({ ownerEmail: email }).toArray();
        const propertyIds = properties.map((property) => property._id.toString());
        // console.log('peoperty ids', propertyIds);

        const bookings = await bookingCollection.find({ propertyId: { $in: propertyIds } }).toArray();
        // console.log('bookins', bookings);

        res.status(200).json(bookings);
      }
      catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });




    // Send a ping to confirm a successful connection----
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Diponkor vaya......!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

