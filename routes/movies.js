const router = require('express').Router();

const { validateMovie, validateMovieID } = require('../utils/validate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', validateMovie, createMovie);
router.delete('/movies/:movieId', validateMovieID, deleteMovie);

module.exports = router;
