
require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const randtoken = require('rand-token')
const userAuthentication = require('./auth')
const Users = require('./user')
const UsersAuth = require('./access_token')
let url = process.env.URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

let app = express()

const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/user/register', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash
        req.body.salt = salt
        const user = new Users(req.body);
        let data = await user.save();
        res.send(data);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.post('/user/login', async (req, res) => {
    try {
        const user = await findByCredentials(req.body.username, req.body.password)
        const access_token = randtoken.generate(16)
        const users = new UsersAuth({
            user_id: user._id,
            access_token: access_token,
            expires_in: 8000
        });
        let data = await users.save();
        res.send(data)
        // res.send({
        //     user_id: req.body.user_id,
        //     access_token: req.body.access_token
        // });
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
});
findByCredentials = async (username, password) => {
    const user = await Users.findOne({ username })

    if (!user) {
        throw new Error("No such username")
    }
    isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("No any matches of password")
    }
    return user
}

app.get('/users/get/', userAuthentication.auth, async (req, res) => {
    try {
        const token = req.headers.token
        const user = await Users.findOne({ "access_token": token })
        res.send(user)
    } catch (e) {
        res.status(401).send(e.message)
    }
});


app.put('/user/delete', userAuthentication.auth, async (req, res) => {
    try {
        const token = req.headers.token
        const deleteUser = await Users.findOneAndDelete({ "access_token": token })
        res.json({ message: 'successully deleted' })
    } catch (e) {
        res.status(401).send(e.message)
    }
});
app.get('/user/get', async function (req, res) {
    const per_page = parseInt(req.query.per_page) || 3
    const page_no = parseInt(req.query.page_no) || 1
    const pagination = {
        limit: per_page,
        skip: per_page * (page_no - 1)
    }
    users = await Users.find().limit(pagination.limit).skip(pagination.skip)
    res.send(users)
});
app.listen(port, () => console.log(`Express server currently running on port ${port}`));
