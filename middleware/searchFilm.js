// Récuperer les films via l'API TMDB
const fetch = require("node-fetch");

const fetchNewFilm = async (req, res, next) => {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY_TMDB}&language=${process.env.API_TMDB_LANG}`;
  const response = await fetch(url);
  const data = await response.json();
  req.newFilm = data;
  next();
};

const fetchFilmById = async (req, res, next) => {
  const movieId = req.params.id;
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY_TMDB}&language=${process.env.API_TMDB_LANG}`;
  const response = await fetch(url);
  const data = await response.json();
  req.filmById = data;
  const urlCredit = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.API_KEY_TMDB}&language=${process.env.API_TMDB_LANG}`;
  const responseCredit = await fetch(urlCredit);
  const dataCredit = await responseCredit.json();
  req.filmByIdCredit = dataCredit;
  next();
};

const fetchFilmByName = async (req, res, next) => {
  const filmName = req.body.film;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&language=${process.env.API_TMDB_LANG}&query=${filmName}`;
  const response = await fetch(url);
  const data = await response.json();
  req.film = data;
  next();
};

const getGenre = async (req, res, next) => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY_TMDB}&language=${process.env.API_TMDB_LANG}`;
  const response = await fetch(url);
  const data = await response.json();
  req.genre = data;
  next();
};

module.exports = {
  fetchFilmByName,
  getGenre,
  fetchNewFilm,
  fetchFilmById
};