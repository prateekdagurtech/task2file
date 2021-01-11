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
    hash: {
        type: String,
        required: true,
        bcrypt: true,
    },
    salt: {
        type: String,
        required: true,
        bcrypt: true,
    },
    address: [{
        type: Schema.Types.ObjectId,
        ref: 'address'
    }]
})

const users = mongoose.model('users', usersSchema);
module.exports = users
