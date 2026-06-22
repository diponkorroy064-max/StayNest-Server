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

    //api---
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
        console.log("RAW ID:", id);

        const query = { _id: new ObjectId(id) };
        const result = await propertyCollections.findOne(query);
        res.json(result || null);

      } catch (error) {
        console.log("BACKEND ERROR:", error.message);

        res.status(500).json({
          message: "Invalid ObjectId or server error"
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

