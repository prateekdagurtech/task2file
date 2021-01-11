const jwt = require('jsonwebtoken')
const accessToken = require('../models/access_token');

module.exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.token
        const decoded = jwt.verify(token, 'thisisprateek')
        const user = await accessToken.findOne({ "user_id": decoded.id, "access_token": token })
        if (!user) {
            throw new Error("no access token or has expired or user is deleted")
        }
        req.user = user
        next()

    } catch (e) {
        res.status(401).send(e.message)
    }
}
// const accessToken = require('../models/access_token');
// module.exports.auth = async (req, res, next) => {
//     try {
//         const token = req.headers.token
//         if (!token) {
//             return res.json({ message: "token not available" })
//         }
//         const user = await accessToken.findOne({ "access_token": token })
//         if (!user) {
//             throw new Error("no access token or has expired or user is deleted")
//         }
//         req.user = user
//         next()
//     } catch (e) {
//         res.status(401).send(e.message)
//     }
// }


