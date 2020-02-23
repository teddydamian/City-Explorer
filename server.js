'use strict'

// brings in the libraries which is our server
require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());

const client = require('./modules/client');
const handleLocation = require('./modules/location');
const handleTrails = require('./modules/trails');
const handleWeather = require('./modules/weather');
const handleMovies = require('./modules/movies');
const handleYelp = require('./modules/yelp');

// get the port from the env
const PORT = process.env.PORT || 3001;


app.get('/location', handleLocation);
app.get('/trails', handleTrails)
app.get('/weather', handleWeather);
app.get('/movies', handleMovies)
app.get('/yelp', handleYelp)

// turn on the server
// app.listen(PORT, () => {
//   console.log(`listening to ${PORT}`);
// })

client.connect()
  .then(() =>{
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })
