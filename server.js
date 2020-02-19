'use strict'

// brings in the expresss library which is our server
const express = require('express');
const app = express();
const superagent = require('superagent');

const cors = require('cors');
app.use(cors())

require('dotenv').config();

// get the port from the env
const PORT = process.env.PORT || 3001;

app.get('/location', (request, response) => {
  try{
    let city = request.query.city;
    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;
    superagent.get(url)
      .then(results => {
        let geoData = results.body;
        let location = new City(city, geoData[0]);
        response.status(200).send(location);
      })
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

app.get ('*', (request, response)=> {
  response.status(404).send('Error 404');
})


app.get('/weather', (request, response) => {
  let {latitude, longitude} = request.query;
  let url = `https://api.darksky.net/forecast/${process.env.GEOCODE_API}/${latitude},${longitude}`;
  superagent.get(url)
    .then(results => {
      let weatherResults = results.body.daily.data;
      let newWeatherArray = newWeatherArray.map(new Weather(weatherResults))
      response.send(newWeatherArray)
    })
})

// weatherArray.forEach(day => {

// })

// try{
// let city = request.query.city;
// let weatherArr = [];
// let darksky = require('./data/darksky.json');
// let weather = request.query.city;

// for (let i = 0; i < darksky.daily.data.length ; i++){
//   let newWeather = new Weather(darksky, i);
//   weatherArr.push(newWeather)
// }
// response.send(weatherArr);
// }
// catch (err){
//   console.log(err);
// }
// })


function Weather(obj, index){
  let date = new Date(obj.daily.data[index].time)
  this.forecast = obj.daily.data[index].summary;
  this.time = date.toDateString();
}




// turn on the server
app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
})
