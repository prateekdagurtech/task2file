const jwt = require('jsonwebtoken')
const express = require('express')
const passport = require('passport');
const authenticate = require('../middleware/passport')
const localStrategy = require('passport-local').Strategy;

const UsersModel = require('../models/user')
const UsersAccessToken = require('../models/access_token')
const UsersAddress = require('../models/address')
const userAuthentication = require('../middleware/auth')
const Secret_Token = process.env.SECRET_TOKEN
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router()
// router.post('/signup', async (req, res) => {
//     try {
//         const salt = bcrypt.genSaltSync(saltRounds);
//         const hash = bcrypt.hashSync(req.body.hash, salt);
//         req.body.hash = hash
//         req.body.salt = salt
//         const user = new UsersModel(req.body);
//         let data = await user.save();
//         res.send(data)
//     }
//     catch (err) {
//         res.status(500).send(err);

//     }
// })

// router.post('/signup', function (req, res, next) {
//     var username = req.body.username;
//     var password = req.body.password;

//     UsersModel.findOne({ username: username }, function (err, user) {

//         if (err) { return next(err); }
//         if (user) {
//             req.flash('error', 'User already exists');
//             return res.redirect('/signup');
//         }

//         var newUser = new User({
//             username: username,
//             password: password
//         });
//         newUser.save(next);

//         passport.authenticate('local', { failureRedirect: '/signup' }),
//             function (req, res) {
//                 res.redirect('/');
//             }
//     });


router.post('/address', async (req, res) => {
    try {
        const user = await UsersAccessToken.findOne(req.user_id)
        req.body.user_id = user.user_id
        const users = new UsersAddress(req.body)
        let data = await users.save()
        let updateUser = await UsersModel.updateOne({ _id: req.body.user_id }, {
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
router.post('/login', passport.authenticate('localStrategy', { successRedirect: '/', failureRedirect: '/login' }), async (req, res, next) => {
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

// router.post('/login', async (req, res) => {
//     try {
//         const user = await findByCredentials(req.body.username, req.body.hash)
//         var token = jwt.sign({ id: user._id }, Secret_Token, { expiresIn: '1h' });
//         const users = new UsersAccessToken({
//             user_id: user._id,
//             access_token: token,
//         });
//         let data = await users.save();
//         res.send(data)
//     } catch (e) {
//         res.status(400).send(e.message)
//     }
// });
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
// router.get('/get/my', userAuthentication, async (req, res) => {
//     res.send(req.user)
//})
router.put('/delete', userAuthentication.auth, async (req, res) => {
    try {
        const user_id = req.user.user_id
        const deleteUser = await UsersModel.findOneAndDelete({ "_id": user_id })
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


module.exports = router