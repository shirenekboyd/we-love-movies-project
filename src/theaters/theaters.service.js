const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//Reduces an array of data by mapping properties onto array properties as objects.
    //each key is the source property and the value is an array representing the path to the new property.
        //Since array index values are not known at configuration time, use `null` to represent unknown index values.
const reducedMovies = reduceProperties("theater_id", {
        movie_id: ["movies", null, "movie_id"],
        title: ["movies", null, "title"],
        runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
        rating: ["movies", null, "rating"],
        description: ["movies", null, "description"],
        image_url: ["movies", null, "image_url"],
        is_showing: ["movies", null, "is_showing"],
    });


function list() {
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("*")
    .then(reducedMovies);
}



module.exports = {
    list,
}