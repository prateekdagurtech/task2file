const mongoose = require('mongoose')
const { Schema } = mongoose;
const tokenSchema = new Schema({
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
    expiry_in: {
        type: Date,
        expires: '3600s',
        default: Date.now()
    },
})
const access_token = mongoose.model('access_token', tokenSchema)
module.exports = access_token 