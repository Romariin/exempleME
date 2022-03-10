const jwt = require('jsonwebtoken');
const User = require("../models/Users");
let bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);

async function verifRegister(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let password_confirm = req.body.confirm_password;
    let pseudo = req.body.pseudo;
    let hash = bcrypt.hashSync(password, salt);

    if (!email || !password || !pseudo) {
        return res.render('register', {
            error: 'Veuillez remplir tous les champs',
            user: req.user
        })
    }
    let emailCheck = await User.findOne({
        email: email
    })
    if (emailCheck) {
        return res.render('register', {
            error: 'Cet email est déjà utilisé',
            user: req.user
        })
    }

    const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
    if (!regexEmail.test(email)) {
        return res.render('register', {
            error: 'Veuillez entrer un email valide',
            user: req.user
        })
    }

    let usernameCheck = await User.findOne({
        pseudo: pseudo
    })
    if (usernameCheck) {
        return res.render('register', {
            error: 'Ce pseudo est déjà utilisé',
            user: req.user
        })
    }
    if (password.length < 6) {
        return res.render('register', {
            error: 'Le mot de passe doit contenir au moins 6 caractères',
            user: req.user
        })
    }

    if (password !== password_confirm) {
        return res.render('register', {
            error: 'Les mots de passe ne correspondent pas',
            user: req.user
        })
    }

    else {
        let newUser = new User({
            email: email,
            password: hash,
            pseudo: pseudo,
        })
        await newUser.save();
        req.flash('success', 'Vous êtes bien inscrit');
        res.redirect('/login');
    }
}


const verifLogin = async (req, res, next) => {
    let auth = req.body.auth
    let password = req.body.password

    if (!auth || !password) {
        return res.render('login', {
            error: 'Veuillez remplir tous les champs',
            user: req.user
        })
    }

    let user = await User.findOne({$or: [{email: auth}, {pseudo: auth}]})
    if (!user) {
        res.render('login', {
            error: "Identifiant inexistant où incorrect",
            user: req.user
        })
    }
    else {
        let passwordCheck = bcrypt.compareSync(password, user.password)
        if (passwordCheck) {
            let token = generateAccessToken(user)
            res.cookie('access_token', token, {
                maxAge: 7200000,
                httpOnly: true
            })
            res.redirect('/')
        }
        else {
            res.render('login', {
                error: "Mot de passe incorrect",
                user: req.user
            })
        }
    }
};

const needAuth = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        req.flash('error', 'Vous devez être connecté pour accéder à cette page');
        return res.status(403).redirect("/login");
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        return next();
    } catch (e){
        console.log(e)
        return res.sendStatus(403);
    }
};

const isAuth = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return false
        }
        req.user = decoded;
        next();
        return true;
    });
};

const isAdmin = async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(401).send({ msg: "Not an admin, sorry" });
    next();
};

function generateAccessToken(user) {
    return jwt.sign(
        { user_id: user._id, user_pseudo: user.pseudo, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
        }
    );
}



module.exports = {verifRegister, verifLogin, needAuth, isAuth, isAdmin};