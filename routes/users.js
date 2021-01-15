const express = require('express')
const cheerio = require('cheerio');
const passport = require('passport')
const rp = require('request-promise')
const UsersModel = require('../models/user')
const UsersAddress = require('../models/address')
const userAuthentication = require('../middleware/auth')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router()
const url = process.env.URL

router.post('/register', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.hash, salt);
        req.body.hash = hash
        req.body.salt = salt
        const user = new UsersModel(req.body);
        let data = await user.save();
        res.send(data)
    }
    catch (err) {
        res.status(500).send(err);

    }
})
router.post('/address', userAuthentication.auth, async (req, res) => {
    try {
        const user_id = req.user.user_id
        const users = new UsersAddress.findOne({ user_id: user_id })
        let data = await users.save()
        let updateUser = await UsersModel.updateOne({ _id: req.body.user_id },
            {
                $push: {
                    address: data._id
                }
            })
        res.send(data);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.get('/get/:_id', async (req, res) => {
    try {
        const user_id = req.params._id
        const user = await UsersModel.findOne({ "_id": user_id }).populate({ path: 'address' })
        if (!user) {
            res.json({ message: 'invalid user' })
        }
        res.send(user)

    } catch (e) {
        res.status(401).send(e.message)
    }
});
router.put('/delete', userAuthentication.auth, async (req, res) => {
    try {
        const user_id = req.user.user_id
        const deleteUser = await UsersModel.findOneAndRemove({ "_id": user_id })
        res.json({ message: 'user deleted' })
    } catch (e) {
        res.status(401).send(e.message)
    }
});
router.get('/get', async function (req, res) {
    const per_page = parseInt(req.query.per_page) || 3
    const page_no = parseInt(req.query.page_no) || 1
    const pagination = {
        limit: per_page,
        skip: per_page * (page_no - 1)
    }
    users = await UsersModel.find().limit(pagination.limit).skip(pagination.skip)
    res.send(users)
});
router.post('/login', passport.authenticate('local', { failureRedirect: 'unsuccess', }), function (req, res, next) {
    res.redirect('success');
})
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
router.get('/success', async function (req, res) {
    res.json({
        status: true,
        message: "You are successfully login check token on console"
    })
});
router.get('/unsuccess', function (req, res) {
    res.json({
        status: false,
        message: "unable to login, try again... check username or password"
    })
});
router.get('/fetch/flipkart/mobile', async function (req, res) {
    rp(url)
        .then(function (html) {
            const $ = cheerio.load(html);
            const mobileDetails = [];
            $('._2kHMtA ').each(function (i, elem) {
                mobileDetails.push({
                    name: $(this).find($('._4rR01T')).text(),
                    price: $(this).find($('._30jeq3')).text(),
                    specs: $(this).find($('._1xgFaf')).text()
                });
            })
            res.send(mobileDetails);
        })
        .catch(function (err) {
            res.status(301).send(err);
        })

})

module.exports = router