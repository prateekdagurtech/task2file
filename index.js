require("dotenv").config()
const Secret_Token = process.env.SECRET_TOKEN
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const express = require('express')
const mongoose = require('mongoose')
const userRouters = require('./routes/users')
const UsersAccessToken = require('./models/access_token')
mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
let app = express()
const port = process.env.PORT || 3000

var passport = require('passport')
app.use(require('serve-static')(__dirname + '../middleware/passport'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


const UsersModel = require('./models/user')
const Strategy = require('passport-local').Strategy;


// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    UsersModel.findById(id, function (err, user) {
        console.log(user);
        cb(err, user);
    });
});

app.use(express.json());
app.use('/user', userRouters)

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
        console.log(data)
        console.log(token_detail.access_token)
        return done(null, user)
    }))

app.post('/user/login', passport.authenticate('local', { successRedirect: '/success', failureRedirect: '/unsuccess' }), async (req, res, next) => { })
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


app.get('/success', async function (req, res) {
    // console.log
    // const filter = { username: 'username' };
    // const update = { access_token: 'access_token' };

    // let doc = await UsersAccessToken.findOneAndUpdate(filter, update, {
    //     new: true,
    //     upsert: true
    // });
    // const data = await doc.save();
    // res.send(data)

    res.json({

        status: true,
        message: "You are successfully login check token on console"
    })
});
app.get('/unsuccess', function (req, res) {
    res.json({
        status: false,
        message: "unable to login, try again... check username or password"
    })
});

app.get('/login', function (req, res) {
    console.log('9999999999999999999999999999999999');
    res.send('login');
});

app.listen(port, () => console.log(`Express server currently running on port ${port}`));

