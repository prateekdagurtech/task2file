const mongoose = require('mongoose')
const { Schema } = mongoose;

const usersSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },

    access_token: {
        type: String,
        required: true,
        unique: true,
    },

    expiry: {
        type: String,
    }

})

const access_token = mongoose.model('access_token', usersSchema)
module.exports = access_token 