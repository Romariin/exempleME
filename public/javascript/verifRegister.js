const User = require("../../models/Users");
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
        })
    }
    let emailCheck = await User.findOne({
        email: email
    })
    console.log(emailCheck)
    if (emailCheck) {
        return res.render('register', {
            error: 'Cet email est déjà utilisé',
        })
    }

    const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
    if (!regexEmail.test(email)) {
        return res.render('register', {
            error: 'Veuillez entrer un email valide',
        })
    }

    let usernameCheck = await User.findOne({
        pseudo: pseudo
    })
    if (usernameCheck) {
        return res.render('register', {
            error: 'Ce pseudo est déjà utilisé',
        })
    }
    if (password.length <= 6) {
        return res.render('register', {
            error: 'Le mot de passe doit contenir au moins 6 caractères',
        })
    }

    if (password !== password_confirm) {
        return res.render('register', {
            error: 'Les mots de passe ne correspondent pas',
        })
    }


    else {
        let newUser = new User({
            email: email,
            password: hash,
            pseudo: pseudo
        })
        await newUser.save();
        req.flash('success', 'Vous êtes bien inscrit');
        res.redirect('/login');
    }
}
module.exports = verifRegister;