'use strict'

require('dotenv').config();
const superagent = require('superagent');

function handleYelp(request, response){

  let city = request.query.search_query;
  let url = `https://api.yelp.com/v3/businesses/search?location=${city}`;

  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(results => {
      let newYelp = results.body.businesses.map(biz => {
        return new Yelp(biz);
      })
      response.status(200).send(newYelp)
    })
}

function Yelp(obj){
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url
}

module.exports = handleYelp;
