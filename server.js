'use strict'

// brings in the libraries which is our server
const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));

const cors = require('cors');
app.use(cors())

require('dotenv').config();

// get the port from the env
const PORT = process.env.PORT || 3001;




app.get('/location', (request, response) => {
  // try{
  let city = request.query.city;
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

  if (!checkDatabase(city)) {
    superagent.get(url)
      .then(results => {
        let geoData = results.body[0];
        let location = new City(city, geoData);
        response.status(200).send(location);
      })
      // .catch(() => {
      //   console.error('Theres an error');
      // });
  }
  else {response.send(checkDatabase(city))}
  // catch (err){
  //   console.log(err);
  // }
})



const checkDatabase = function (city) {
  let SQL = 'SELECT * FROM location WHERE search_query LIKE ($1)';
  // console.log('checking DB')
  let safeValue = [city];
  client.query(SQL, safeValue)
    .then(results => {
      console.log(results);
      return results.rows;
    })
    .catch(err =>{
      console.log(err)
    })
}



app.get('/weather', (request, response) => {
  // console.log(request.query);
  let locationObj = request.query;
  console.log(locationObj);

  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${locationObj.latitude},${locationObj.longitude}`;

  superagent.get(url)
    .then(results => {
      let weatherResults = results.body.daily.data;
      let newWeatherArray = weatherResults.map(day => new Weather(day))
      response.send(newWeatherArray);
    })
})

app.get('/trails', (request, response) => {
  let {
    latitude,
    longitude, } = request.query;

  let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAIL_API_KEY}`;

  superagent.get(url)
    .then(results => {
      const dataObj = results.body.trails.map(trail => new Trail(trail));
      response.status(200).send(dataObj)
    })
})


function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.insertData();
}

function Weather(obj){
  this.time = new Date(obj.time * 1000).toDateString();
  this.forecast = obj.summary;
}

function Trail(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  this.condition_date = obj.conditionDate.slice(0,10);
  this.condition_time = obj.conditionDate.slice(11,19);
}

app.get ('*', (request, response)=> {
  response.status(404).send('Error 404');
})

// turn on the server
// app.listen(PORT, () => {
//   console.log(`listening to ${PORT}`);
// })

City.prototype.insertData = function () {
  let SQL = 'INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
  let safeValues = [this.search_query, this.formatted_query, this.latitude, this.longitude];
  console.log(safeValues);
  client.query(SQL, safeValues);
}


client.connect()
  .then(
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  );
