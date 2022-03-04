var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/add', function(req, res) {

});

router.get('/get', function(req, res) {
  res.send('Ok - Get');
});
module.exports = router;
