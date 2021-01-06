
require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const userRouters = require('./routes/users')
//url = 'mongodb+srv://prateek:java1234@cluster0.vkgzh.mongodb.net/nodedb?retryWrites=true&w=majority'
let url = process.env.url
console.log(url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
let app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(userRouters)

app.listen(port, () => console.log(`Express server currently running on port ${port}`));

