const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express());

app.get('/',(req, res)=>{
    res.send('Food Delivery server is working')
})

app.listen(port, ()=>{
    console.log(`Food Delivery server is running on ${port}`)
})
