const User = require("../../models/Users");
let bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function verifLogin(req, res) {
    let auth = req.body.auth
    let password = req.body.password

    if (!auth || !password) {
        return res.render('login', {
            error: 'Veuillez remplir tous les champs',
        })
    }

    let authCheck = await User.find({$or: [{email: auth}, {pseudo: auth}]})
    if (!authCheck.length) {
        res.render('login', {
            error: "Identifiant inexistant où incorrect"
        })
    }
    else {
        let passwordCheck = bcrypt.compareSync(password, authCheck[0].password)
        if (passwordCheck) {
            let token = jwt.sign({pseudo: authCheck[0].pseudo, email: authCheck[0].email,
            }, process.env.JWT_SECRET, {expiresIn: '1h'})
            res.cookie('token', token, {maxAge: 3600000, httpOnly: true})
            res.redirect('/')
        }
        else {
            res.render('login', {
                error: "Mot de passe incorrect"
            })
        }
    }
}

module.exports = verifLogin;