'use strict'

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const data = require("./data.json");
const pg = require("pg");


const app = express();
app.use(cors());
require("dotenv").config();

app.use(express.json());
// app.use(errorHandler)

const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL)

//constructor
function MovieLibrary(id, title, release_date, poster_path, overview) {
    this.id = id
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


//Routes
app.get('/', (req, res) => {
    const movieData = require('./data.json')
    const movie = new MovieLibrary(movieData.title, movieData.poster_path, movieData.overview)
    res.status(200).send(movie)
});

app.get('/favorite', (req, res) => {
    res.status(200).send('Welcome to Favorite Page');
});

//----------------------------------------

app.get('/trending', trendingHandlers)
app.get('/search', searchHandlers)
app.get('/genres', genresHandlers)
app.get('/last', lastHandlers)
app.get('/getMovies', getMovieHandlers)
app.post('/addMovie', addMovieHandlers)

app.delete('/DELETE/:id', deleteHandlers)
app.put('/UPDATE/:id', updateHandlers)
app.get('/getMovie/:id', getSpecificHandlers)

app.get('*', (req, res) => {
    res.status(404).send('page not found error')
})


// Functions Handlers

function trendingHandlers(req, res) {
    try {
        const APIkey = process.env.APIKEY;
        console.log(APIkey)
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIkey}&language=en-US`

        axios.get(url)
            .then((Result) => {

                let mapResult = Result.data.results.map((item) => {
                    let trendMovie = new MovieLibrary(item.id, item.title, item.release_date, item.poster_path, item.overview)
                    return trendMovie
                })
                res.send(mapResult);
            })

            .catch((err) => {
                console.log(err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

//--------------

function searchHandlers(req, res) {
    try {
        const APIkey = process.env.APIKEY;
        console.log(APIkey)
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIkey}&language=en-US&query=The&page=3`

        axios.get(url)
            .then((Result) => {
                res.send(Result.data);
            })

            .catch((err) => {
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

//------------

function genresHandlers(req, res) {
    try {
        const APIkey = process.env.APIKEY;
        console.log(APIkey)
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIkey}&language=en-US`

        axios.get(url)
            .then((Result) => {
                res.send(Result.data);
            })
            .catch((err) => {
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

//-----------

function lastHandlers(req, res) {
    try {
        const APIkey = process.env.APIKEY;
        console.log(APIkey)
        const url = `https://api.themoviedb.org/3/movie/latest?api_key=${APIkey}&language=en-US`

        axios.get(url)
            .then((Result) => {
                res.send(Result.data);
            })
            .catch((err) => {
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function getMovieHandlers(req, res) {

    const sql = `SELECT * FROM movie`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

//---------

function addMovieHandlers(req, res) {

    const movies = req.body;
    console.log(movies);

    const sql = `INSERT INTO movie (title, release_date, poster_path, comment) VALUES ($1,$2,$3,$4) RETURNING *;`
    const values = [movies.title, movies.release_date, movies.poster_path, movies.comment];

    console.log(sql);

    client.query(sql, values)
        .then((data) => {
            res.send("your data was added !");
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
}

function deleteHandlers(req, res) {

    const id = req.params.id;
    const sql = `DELETE FROM movie WHERE id=${id}`;

    client.query(sql)
        .then((data) => {
            res.status(204).json({})
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}
//-------------

function updateHandlers(req, res) {

    const movies = req.body;
    const id = req.params.id;
    const sql = `UPDATE movie SET title=$1, release_date=$2, poster_path=$3,
    comment=$4 WHERE id=${id} RETURNING *`;

    const values = [movies.title, movies.release_date, movies.poster_path, movies.comment];

    client.query(sql, values)
        .then((data) => {
            res.status(200).send(data.rows)
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

//------------

function getSpecificHandlers(req,res){

    const id = req.params.id;
    const sql = `SELECT * FROM movie WHERE id=${id}`;
    console.log(id);
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

//----------------------------------------------------

//middleware function

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        massage: error
    }
    res.status(500).send(err);
}

//-----------------------------------
// app.get('*',(res,req)=>{
//     res.status(500).json({
// "status": 500,
// "responseText": "Sorry, something went wrong"
// });
// })

client.connect()
    .then(() => {
        app.listen(port, () => {
            console.log('Server listening on port: ', port);
        });
    });
