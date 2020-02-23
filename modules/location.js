'use strict'

require('dotenv').config();
const superagent = require('superagent');
const client = require('./client')


function handleLocation(request, response) {
  let city = request.query.city;

  let SQL = 'SELECT * FROM location WHERE search_query LIKE ($1)';
  let safeValue = [city];
  client.query(SQL, safeValue)
    .then(results => {
      if(results.rows.length > 0){
        response.send(results.rows[0]);
      }else{
        let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

        superagent.get(url)
          .then(results => {
            let geoData = results.body[0];
            let location = new City(city, geoData);
            let SQL = 'INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
            let safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];

            client.query(SQL, safeValues);
            response.status(200).send(location);

          }).catch(err => console.error(err));
      }
    })
}

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

module.exports = handleLocation;
