require("dotenv").config()
const Secret_Token = process.env.SECRET_TOKEN
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
var request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')
const rp = require('request-promise')

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

app.get('/fetch/flipkart/mobile', async function (req, res) {

    url = 'https://www.flipkart.com/search?p%5B%5D=facets.brand%255B%255D%3DSamsung&sid=tyy%2F4io&sort=recency_desc&wid=1.productCard.PMU_V2_1'
    // rp(url, function (error, response, html) {
    //     if (!error && response.statusCode == 200) {
    //         var $ = cheerio.load(html);
    //         console.log($)
    //         var ps = [];
    //         $("_2pi5LC").each(function (i, elem) {
    //             console.log(elem)
    //             //   process.exit(0)
    //             var club_url = $(this).children().first().children().attr("href");
    //             club_url = url.substring(0, 25) + club_url;
    //             console.log(club_url);
    //             var club_options = {
    //                 uri: club_url,
    //                 transform: function (body) {
    //                     return cheerio.load(body);
    //                 }
    //             };
    //             ps.push(rp(club_options));
    //         })
    //         fs.writeFile('output.json', JSON.stringify(url, null, 4), function (err) {
    //             console.log('File successfully written! - Check your project directory for the output.json file');
    //         });
    //         res.send('Scraping is done, check the output.json file!');
    //     }
    // })

    rp(url)
        .then(function (html) {
            const $ = cheerio.load(html);
            const wikiName = [];
            $('._2pi5LC').each(function (i, elem) {
                console.log(elem)
                wikiName.push({
                    name: $(this).find($('.iUmrbN')).text(),
                    price: ($(this).find($('.M_qL-C')).text() || $(this).find($('._3o3r66')).text()),
                    specs: $(this).find($('.BXlZdc')).text()
                });
            })
            res.send(wikiName);
        })
        .catch(function (err) {
            res.status(301).send(err);
        })

})


// request('http://www.google.com', function (error, response, body) {
//     console.error('error:', error);
//     console.log('statusCode:', response && response.statusCode);
//     console.log('body:', body);
//     res.send(body)



app.listen(port, () => console.log(`Express server currently running on port ${port}`))



let fetchMobiles = async (req, res, next) => {
    const url = req.body.url;
    rp(url)
        .then(function (html) {
            const $ = cheerio.load(html);
            const wikiName = [];
            $('._2kSfQ4').each(function (i, elem) {
                wikiName.push({
                    name: $(this).find($('.iUmrbN')).text(),
                    price: ($(this).find($('.M_qL-C')).text() || $(this).find($('._3o3r66')).text()),
                    specs: $(this).find($('.BXlZdc')).text()
                });
            })
            res.send(wikiName);
        })
        .catch(function (err) {
            res.status(301).send(err);
        })
};

module.exports = {
    fetchMobiles
};