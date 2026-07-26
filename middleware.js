const jwt = require('jsonwebtoken');
require('dotenv').config();


function authMiddleware(req, res, next) {


    const token = req.headers['token'];

    if (!token) {

        res.status(403).json({
            message : "Invalid Token"
        })
        return;
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message : "Invalid Token"
            })
            return;
        }

    } catch (err) {

        res.status(403).json({
            message : "Invalid Token"
        })

    }


}


module.exports = {
    authMiddleware
}