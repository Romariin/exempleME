var express = require('express');
var router = express.Router();
const verifRegister = require('../public/javascript/verifRegister');
const verifLogin = require('../public/javascript/verifLogin');
const authenticateJWT = require('../middleware/authenticateJWT');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.headers.cookie);
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { error: ''});
});

router.post('/register', function(req, res, next) {
  verifRegister(req, res)
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: ''});
});

router.post('/login', function(req, res) {
  verifLogin(req, res)
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
})

router.get('/profile', authenticateJWT, function(req, res){
  res.render('profile', { user: req.user });
})


module.exports = router;
