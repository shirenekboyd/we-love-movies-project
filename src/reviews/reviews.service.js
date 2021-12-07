//const { first } = require("../db/connection");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
})

const reducedMovies = reduceProperties("theater_id", {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    is_showing: ["movies", null, "is_showing"],
});

function create(review){
    return knex("reviews")
    .insert(review)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(review_id) {
    return knex("reviews")
    .select("*")
    .where({ review_id })
    .first();
}

function update(updatedReview) {
    return knex("reviews")
    .select("*")
    .where({ review_id:updatedReview.review_id })
    .update(updatedReview, "*");
}


function newlyUpdatedReview(reviewId) {
    return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "r.review_id":reviewId })
    .first()
    .then(addCritic)
    //.then(reducedMovies);
}

function destroy(review_id) {
    return knex("reviews").where({ review_id }).del();
}


module.exports = {
    create,
    read,
    update,
    delete: destroy,
    newlyUpdatedReview,
}