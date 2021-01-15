const jwt = require('jsonwebtoken')
const passport = require('passport')
const UsersAccessToken = require('../models/access_token')
const UsersModel = require('../models/user')
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const Secret_Token = process.env.SECRET_TOKEN

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
    UsersModel.findById(id, function (err, user) {
        cb(err, user);
    });
});
passport.use(new Strategy(
    async function (username, password, done) {
        let user = await findByCredentials(username, password)
        const payload = {
            admin: user._id
        };
        const token = jwt.sign(payload, Secret_Token, {
            expiresIn: 86400
        });
        const token_detail = ({
            success: true,
            message: 'Login Successfully done..... Enjoy your token!',
            access_token: token

        });
        const data = await UsersAccessToken.findOneAndUpdate({ "user_id": user._id })
        return done(null, user)
    }))

findByCredentials = async (username, hash) => {
    const user = await UsersModel.findOne({ username })
    if (!user) {
        throw new Error("No such username")
    }
    isMatch = await bcrypt.compare(hash, user.hash)
    if (!isMatch) {
        throw new Error("No any matches of password")
    }
    return user
}

module.exports = { passport: passport }