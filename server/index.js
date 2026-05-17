const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const dontenv = require('dotenv')
dontenv.config()
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors())
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("travelast")
    const destinationCollection = db.collection('destinations')


    app.post('/destination', async (req, res) => {
      const destination = req.body
      if (destination) console.log(destination);
      const result = await destinationCollection.insertOne(destination)
      res.json(result)
    })

    app.get('/destination', async (req, res) => {
      const result = await destinationCollection.find().toArray()

      res.json(result)
    })
    app.get('/destination/:id', async (req, res) => {
      const { id } = await req.params
      const result = await destinationCollection.findOne({ '_id': new ObjectId(id) })

      res.json(result)
    })
    app.patch('/destination/:id', async (req, res) => {
      const { id } = await req.params
      const upadteData = await req.body
      console.log(upadteData);
      const result = await destinationCollection.updateOne(

        {
          '_id': new ObjectId(id)
        },
        {
          $set: upadteData
        }
      )

      res.json(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


