var express = require('express');
var router = express.Router();
const {verifRegister, verifLogin, isAdmin, isAuth, needAuth} = require('../middleware/auth');

/* GET home page. */

router.get('/', isAuth, function (req, res, next) {
    const test = res.header('authorization');
    console.log(test)
    res.render('index', {title: 'Express', user: req.user});
});

router.get('/register', isAuth, function (req, res, next) {
    if (req.user) return res.redirect("/")
    res.render('register', {error: '', user: req.user});
});

router.post('/register', verifRegister, function (req, res, next) {
});

router.get('/login', isAuth, function (req, res, next) {
    if (req.user) return res.redirect("/")
    res.render('login', {error: '', user: req.user});

});

router.post('/login', verifLogin, function (req, res) {
    res.send(res.locals);
});

router.get('/logout', function (req, res) {
    req.flash("success", "Vous avez été correctement déconnecter!")
    return res
        .clearCookie("access_token")
        .status(200)
        .redirect("/")
})

router.get('/profile', needAuth, function (req, res) {
    const test = res.header('x-access-token')
    console.log(test)
    res.render('index', {title: 'Profile', user: req.user});
})

router.get('/admin', needAuth, isAdmin, function (req, res) {
    res.render('index', {title: 'Admin', user: req.user});
})


module.exports = router;