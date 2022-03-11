// Récuperer les films via l'API TMDB
const fetch = require("node-fetch");
const fetchFilmByName = async (req, res, next) => {
  const filmName = req.body.film;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&language=${process.env.API_TMDB_LANG}&query=${filmName}`;
  const response = await fetch(url);
  const data = await response.json();
  req.film = data;
  next();
};

module.exports = {
  fetchFilmByName,
};