const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uyqo5y4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('foodService').collection('services');
        // get data form database and send to client side
        app.get('/services', async(req, res)=>{
            const limitRequest = parseInt(req.query.limit);
            const query = {};
            const cursor = serviceCollection.find(query);
            let result = '';
            if(limitRequest){
                result = await cursor.limit(limitRequest).toArray()
            }else{
                result =  await cursor.toArray()
            }
            res.send(result)
        })

        // get single data
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })
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
