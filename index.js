const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uyqo5y4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('foodService').collection('services');
        const reviewCollection = client.db('foodService').collection('reviews');
        // get data form database and send to client side
        app.get('/services', async (req, res) => {
            const limitRequest = parseInt(req.query.limit);
            const query = {};
            const cursor = serviceCollection.find(query);
            let result = '';
            if (limitRequest) {
                result = await cursor.limit(limitRequest).toArray()
            } else {
                result = await cursor.toArray()
            }
            res.send(result)
        })

        // get single data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })

        // Add Service
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service)
            res.send(result);
        })

        // Add Reviews on the Database
        app.post('/reviews', async (req, res) => {
            const reviewItem = req.body;
            const result = await reviewCollection.insertOne(reviewItem);
            res.send(result);
        })

        // get reviews as per query: email & id
        app.get('/reviews', async (req, res) => {
            const requestId = req?.query?.id;
            const requestEmail = req?.query?.email;
            let query = '';
            if (!requestId && !requestEmail) {
                res.send('result not found')
                return;
            }
            else if (requestId) {
                query = { serviceId: requestId };
            } else if (requestEmail) {
                query = { email: requestEmail }
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        // Get single review
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            res.send(result)
        })

        // update review
        app.patch('/reviews/:id', async (req, res)=>{
            const id = req.params.id;
            const updatedReview =  req.body;
            const query = {_id: ObjectId(id)}
            const updatedDoc = {
                $set:{
                    rating:updatedReview.rating,
                    message:updatedReview.message
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

        // Delete Review
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('Food Delivery server is working')
})


app.listen(port, () => {
    console.log(`Food Delivery server is running on ${port}`)
})
