const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uyqo5y4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('foodService').collection('foodItems');
        const service = {
            foodItem:'vagitable',
            price:'30'
        }
        const result = await serviceCollection.insertOne(service)
        console.log(`food item inserted ${result}`)
    }
    finally{

    }
}
run().catch(err=>console.error(err))



app.get('/',(req, res)=>{
    res.send('Food Delivery server is working')
})

app.listen(port, ()=>{
    console.log(`Food Delivery server is running on ${port}`)
})
