const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        console.log("No token found");
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

module.exports = verifyToken;