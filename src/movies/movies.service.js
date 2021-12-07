const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function list() {
  return knex("movies").select("*");
}

//--GET /movies?is_showing=true
function listOfMoviesInTheaters() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": true })
    .orderBy("m.movie_id");
}


function read(movie_id) {
  return knex("movies")
  .select("*")
  .where({ movie_id: movie_id })
  .first();
}

//GET /movies/:movieId/theaters
//This route should return all the `theaters` where the movie is playing. This means you will need to check
//the `movies_theaters` table.
function listOfTheatersPlayingMovie(movie_id) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("*")
    .where({ "mt.movie_id": movie_id });
}

//--GET /movies/:movieId/reviews--should return all 'reviews' for the movie, including all 'critic' details added
function listMatchingReviews(movie_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "r.movie_id": movie_id })
    .then((reviewsArr) => reviewsArr.map(addCritic));
}

module.exports = {
  list,
  listOfMoviesInTheaters,
  read,
  listOfTheatersPlayingMovie,
  listMatchingReviews,
};
