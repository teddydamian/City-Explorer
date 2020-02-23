'use strict'

require('dotenv').config();
const superagent = require('superagent');


function handleWeather(request, response) {
  let locationObj = request.query;
  console.log(locationObj);

  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${locationObj.latitude},${locationObj.longitude}`;

  superagent.get(url)
    .then(results => {
      let weatherResults = results.body.daily.data;
      let newWeatherArray = weatherResults.map(day => new Weather(day))
      response.send(newWeatherArray);
    })
}

function Weather(obj){
  this.time = new Date(obj.time * 1000).toDateString();
  this.forecast = obj.summary;
}


module.exports = handleWeather;
