const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
//const hasProperties = require("../errors/hasProperties");


//GET /movies?is_showing=true
//In the event where `is_showing=true` is provided, the route should return _only those movies where the movie is currently showing in theaters.
//_ This means you will need to check the `movies_theaters` table.
async function list(req, res, next) {
    const { is_showing } = req.query;
    if (is_showing) {
    const data = await moviesService.listOfMoviesInTheaters()
    res.json({ data })
    }else{
    const data = await moviesService.list()
    res.json({ data })
    }
    
};


async function movieExists(req, res, next) { 
    const movie = await moviesService.read(req.params.movieId);
        if (movie) {
            res.locals.movie = movie;
            return next();
        }
        next({ status: 404, message: `Movie cannot be found.`});
    }


async function read(req, res) {
    const { movie } = res.locals;
    const data = await moviesService.read(movie.movie_id)
    res.json({ data })
}

//GET /movies/:movieId/theaters
//This route should return all the `theaters` where the movie is playing. This means you will need to check
//the `movies_theaters` table.
async function theatersMovieIsPlaying(req, res) {
    const { movie } = res.locals;
    const data = await moviesService.listOfTheatersPlayingMovie(movie.movie_id)
    res.json({ data })

}

async function listMatchingReviews(req, res) {
    const { movie } = res.locals;
    const data = await moviesService.listMatchingReviews(movie.movie_id)
    res.json({ data })

}


 

module.exports = {
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    list: asyncErrorBoundary(list),
    theaterList: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theatersMovieIsPlaying)],
    reviewList: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listMatchingReviews)],
}