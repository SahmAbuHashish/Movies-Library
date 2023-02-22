'use strict'

const express = require("express");
const cors = require("cors");
const data = require("./data.json");

const app = express();
app.use(cors());

// app.use(data());

const port = 3000;


function GetData (jsonData){
    this.data = jsonData
}
const newGetData = new GetData (data)


app.get('/',(req,res)=>{
    let str = 'Welcome to home Page'
    res.status(200).send(str);

    res.status(200).json({
"title": "Spider-Man: No Way Home",
"poster_path": "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
"overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man."
});
});

app.get('/favorite',(req,res)=>{
    let str1 = 'Welcome to Favorite Page'
    res.status(200).send(str1);
});

app.get('*',(res,req)=>{
    res.status(500).json({
"status": 500,
"responseText": "Sorry, something went wrong"
});
})

app.get('*',(req,res)=>{
    res.status(404).send('page not found error')
    
})

app.listen(port,()=>{
    console.log('Server listening on port: ',port);
});