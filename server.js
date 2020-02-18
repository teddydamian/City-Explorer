'use strict'

// brings in the expresss library which is our server
const express = require('express');

// instantiates the express library in app
const app = express();

// lets us go into the .env and get the variables
require('dotenv').config();

// the policeman - lets the server know that it is OK to give information to the front end
const cors = require('cors');
app.use(cors())

// get the port from the env
const PORT = process.env.PORT || 3001;

app.get('/location', (request, response) => {
  try{
    let city = request.query.city;
    let geoData = require('./data/geo.json');
    let location = new City(city, geoData[0])
    response.send(location);
  }
  catch (err){
    console.log(err);
  }
})

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


app.get('/weather', (request, response) => {
  try{
    // let city = request.query.city;
    let weatherArr = [];
    let darksky = require('./data/darksky.json');
    let weather = request.query.city;

    for (let i = 0; i < darksky.daily.data.length ; i++){
      let newWeather = new Weather(darksky, i);
      weatherArr.push(newWeather)
    }
    response.send(weatherArr);
  }
  catch (err){
    console.log(err);
  }
})

function Weather(obj, index){
  let date = new Date(obj.daily.data[index].time)
  this.forecast = obj.daily.data[index].summary;
  this.time = date.toDateString();
}



// turn on the server
app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
})
