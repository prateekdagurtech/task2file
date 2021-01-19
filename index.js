require("dotenv").config();
const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const userRouters = require('./routes/users')
mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
let app = express()
const port = process.env.PORT || 3000
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/user', userRouters)
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
require('./middleware/passport').passport


app.listen(port, () => console.log(`Express server currently running on port ${port}`))