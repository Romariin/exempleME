var express = require('express');
var router = express.Router();
const verifRegister = require('../public/javascript/verifRegister');
const verifLogin = require('../public/javascript/verifLogin');
const authenticateJWT = require('../middleware/authenticateJWT');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.cookies.access_token });
});

router.get('/register', function(req, res, next) {
  if (req.cookies.access_token) return res.redirect("/")
  res.render('register', { error: '', user: req.cookies.access_token});
});

router.post('/register', function(req, res, next) {
  verifRegister(req, res)
});

router.get('/login', function(req, res, next) {
  if (req.cookies.access_token) return res.redirect("/")
  res.render('login', { error: '', user: req.cookies.access_token });
});

router.post('/login', function(req, res) {
  verifLogin(req, res)
});

router.get('/logout', function(req, res){
  if (!req.cookies.access_token) return res.redirect("/");
  req.flash("success", "Vous avez été correctement déconnecter!")
  return res
      .clearCookie("access_token")
      .status(200)
      .redirect("/")
})

router.get('/profile', authenticateJWT, function(req, res){
  console.log(req.user);
  res.render('index', { title: 'Profile', user: req.cookies.access_token });
})


module.exports = router;
