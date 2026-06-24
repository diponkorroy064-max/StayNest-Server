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
    await client.connect();
    const database = client.db("staynest");

    const propertyCollections = database.collection('properties');
    const favouritesCollection = database.collection('favourites');

    //properties api---
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











    // Send a ping to confirm a successful connection----
    await client.db("admin").command({ ping: 1 });
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

