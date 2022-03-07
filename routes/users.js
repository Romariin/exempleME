var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var User = require("../models/Users");

/* GET users listing. */
router.get('/add', function(req, res) {
  User.create({
    name: 'John',
    email: 'Salam',
    password: '123'
  }).then(function(user){
    res.send(user);
  });
});

router.get('/get', function(req, res) {
  res.send('Ok - Get');
});
module.exports = router;