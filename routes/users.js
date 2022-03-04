var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
});

var User = mongoose.model("User", UserSchema, "users");


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
