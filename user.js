const mongoose = require('mongoose')
const { Schema } = mongoose;

const usersSchema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        bcrypt: true,
    },

    salt: {
        type: String,
        required: true,
        bcrypt: true,
    },

})

const Usersdata = mongoose.model('users', usersSchema);

module.exports = Usersdata
