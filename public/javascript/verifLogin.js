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

    let user = await User.findOne({$or: [{email: auth}, {pseudo: auth}]})
    console.log(user)
    if (!user) {
        res.render('login', {
            error: "Identifiant inexistant où incorrect"
        })
    }
    else {
        let passwordCheck = bcrypt.compareSync(password, user.password)
        if (passwordCheck) {
            let token = jwt.sign({
                user_id: user._id, auth
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })
            await user.updateOne({token: token})
            res.cookie('access_token', token, {
                maxAge: 7200000,
                httpOnly: true
            })
            res.status(200).redirect('/')
        }
        else {
            res.render('login', {
                error: "Mot de passe incorrect"
            })
        }
    }
}

module.exports = verifLogin;