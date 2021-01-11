const jwt = require('jsonwebtoken')
const accessToken = require('../models/access_token');
const Secret_Token = process.env.SECRET_TOKEN
module.exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.token
        const decoded = jwt.verify(token, Secret_Token)
        const user = await accessToken.findOne({ "user_id": decoded.id, "access_token": token })
        req.user = user
        next()

    } catch (e) {
        res.status(401).send(e.message)
    }
}
