const Users = require('./access_token');
module.exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.token
        if (!token) {
            return res.json({ message: "token not available" })
        }
        const user = await Users.findOne({ "access_token": token })
        if (!user) {
            throw new Error("no user")
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send(e.message)
    }

}


