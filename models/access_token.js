const mongoose = require('mongoose')
const { Schema } = mongoose;
const tokenSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    access_token: {
        type: String,
        required: true,
    },

})
const access_token = mongoose.model('access_token', tokenSchema)
module.exports = access_token 