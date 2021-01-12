require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const userRouters = require('./routes/users')
mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
let app = express()
const port = process.env.PORT || 3000

var passport = require('passport')
app.use(require('serve-static')(__dirname + '../middleware/passport'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


const UsersModel = require('../models/user')
const Strategy = require('passport-local').Strategy;


// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use('/user', userRouters)

passport.use(new Strategy(function (username, hash, cb) {
    UsersModel.findOne({ username: username }, function (err, user) {
        if (err) { return cb(err); }
        if (!user) {
            return cb(null, false, { message: 'Incorrect username.' });
        }

        if (!user.validPassword(hash)) {
            return cb(null, false, { message: 'Incorrect password.' });
        }
        return cb(null, user);
    });
}
));

app.post('/user/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), async (req, res, next) => {
    try {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        const user = await findByCredentials(req.body.username, req.body.hash)
        var token = jwt.sign({ id: user._id }, 'Secret_Token', { expiresIn: '1h' });
        const users = new UsersAccessToken({
            user_id: user._id,
            access_token: token,
        });
        console.log(users)
        let data = await users.save();
        res.send(data)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// app.get('/logout', function (req, res) {
//     console.log('33333333334444444444444444444444444444444333333333333333333');
//     res.send('login');
// });

app.get('/login', function (req, res) {
    console.log('333333333333333333333333333333333333333333333');
    res.send('login');
});

app.listen(port, () => console.log(`Express server currently running on port ${port}`));

