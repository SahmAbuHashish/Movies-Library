'use strict'

const express = require("express");
const cors = require("cors");
// const data = require("./data.json");

const app = express();
app.use(cors());

const port = 3000;

function MovieLibrary (title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get('/',(req,res)=>{
    
    const movieData = require('./data.json')
    const movie = new  MovieLibrary(movieData.title, movieData.poster_path, movieData.overview)
    res.status(200).send(movie)
});

app.get('/favorite',(req,res)=>{
    res.status(200).send('Welcome to Favorite Page');
});

// app.get('*',(res,req)=>{
//     res.status(500).json({
// "status": 500,
// "responseText": "Sorry, something went wrong"
// });
// })

app.get('*',(req,res)=>{
    res.status(404).send('page not found error')
    
})

app.listen(port,()=>{
    console.log('Server listening on port: ',port);
});