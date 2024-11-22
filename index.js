const express = require('express');
const cors = require('cors');
const path = require('path');
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
    
    // await client.connect();

    const itemCollection = client.db('itemDB').collection('item');
    const categoryCollection = client.db('itemDB').collection('subcategory');
    
    app.post('/items', async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
  })
  app.get('/items/email/:email', async (req, res) =>{
    const userEmail = req.params.email;
    console.log(userEmail)
    const result =  await itemCollection.find({email:userEmail}).toArray();
    res.send(result);
  })
  app.get('/items/id/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await itemCollection.findOne(query);
    res.send(result);
  })
  app.put('/items/id/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const itemUpdated = req.body;

    const item = {
        $set: {
          photo_url: itemUpdated.photo_url,
          item_name : itemUpdated.item_name,
          customization: itemUpdated.customization,
          subcategory_Name: itemUpdated.subcategory_Name,
          stockStatus: itemUpdated.stockStatus,
          description: itemUpdated.description,
          price: itemUpdated.price,
          processing_time: itemUpdated.processing_time,
          rating: itemUpdated.rating
        }
    }

    const result = await itemCollection.updateOne(filter, item, options);
    res.send(result);
})



    app.get('/items', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result)
      
    })
    
    
    app.delete('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    })
   
   
    app.get('/category', async (req, res) => {
      const cursor = categoryCollection.find();
      console.log(cursor)
      const result = await cursor.toArray();
      res.send(result);
    })

    
    app.get('/items/category/:url', async (req, res) =>{
      const Category = req.params.url;
      const userCategory = Category.replace(/_/g, " ");
      console.log(userCategory)
      const result =  await itemCollection.find({subcategory_Name:userCategory}).toArray();
      res.send(result);
      console.log(result);
    })

     //Vercel

  //  await client.db("admin").command({ ping: 1 });
  //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.use(express.static(path.join(__dirname, 'public')));

// Define route to serve the 'home.html' file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '/public/home.html');
  console.log(`Attempting to serve file: ${filePath}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving file: ${err}`);
      res.status(err.status).end();
    } else {
      console.log(`File sent successfully: ${filePath}`);
    }
  });
});

app.listen(port, () =>{
    console.log(port)
})