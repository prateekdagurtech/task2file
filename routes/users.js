const express = require('express')
const UsersModel = require('../models/user')
const UsersAccessToken = require('../models/access_token')
const UsersAddress = require('../models/address')
const userAuthentication = require('../middleware/auth')
const randtoken = require('rand-token')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = new express.Router()
router.post('/user/register', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.hash, salt);
        req.body.hash = hash
        req.body.salt = salt
        const user = new UsersModel(req.body);
        let data = await user.save();
        res.send(data);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

router.post('/address', async (req, res) => {
    try {
        const user = await UsersAccessToken.findOne(req.user_id)
        req.body.user_id = user.user_id
        const users = new UsersAddress(req.body)
        let data = await users.save()
        res.send(data);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.post('/login', async (req, res) => {
    try {
        const user = await findByCredentials(req.body.username, req.body.hash)
        const access_token = randtoken.generate(16)
        const users = new UsersAccessToken({
            user_id: user._id,
            access_token: access_token,
        });
        let data = await users.save();
        res.send(data)
    } catch (e) {
        res.status(400).send(e.message)
    }
});
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
router.get('/get/', userAuthentication.auth, async (req, res) => {
    res.send(req.user)
});
router.put('/delete', userAuthentication.auth, async (req, res) => {
    try {
        token = req.headers.token
        const deleteUser = await UsersAccessToken.findOneAndDelete({ "access_token": token })
        res.json({ message: 'successully deleted' })
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