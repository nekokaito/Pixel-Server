const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${username}:${password}@mydatabase.rpe1dlh.mongodb.net/?retryWrites=true&w=majority&appName=MyDataBase`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const itemCollection = client.db('itemDB').collection('item');

    app.get('/items', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    
    app.post('/items', async (req, res) => {
        const newItem = req.body;
        console.log(newItem);
        const result = await itemCollection.insertOne(newItem);
        res.send(result);
    })
    
    app.get('/items/:email', async (req, res) =>{
      const userEmail = req.params.email;
      console.log(userEmail)
      const result =  await itemCollection.find({email:userEmail}).toArray();
      res.send(result);
    })

    app.delete('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) =>{
    res.send("Our Server is Running");
})

app.listen(port, () =>{
    console.log(port)
})