'use strict'

require('dotenv').config();
const superagent = require('superagent');


function handleMovies(request, response) {
  let location = request.query.search_query

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API}&language=en-US&query=${location}&page=1&include_adult=true`
  superagent.get(url)
    .then(results => {
      const newMov = results.body.results;
      const newData = newMov.map(movie => new Movie(movie));
      response.status(200).send(newData)
    })
}


function Movie(obj){
  this.title = obj.original_title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.popularity = obj.vote_popularity;
  this.released_on = obj.release_date;
  this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
}


module.exports = handleMovies;
