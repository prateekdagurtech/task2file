const mongoose = require('mongoose')
const { Schema } = mongoose;
const usersSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pin_code: {
        type: Number
    },
    phone_no: {
        type: Number
    },
})
const address = mongoose.model('address', usersSchema)
module.exports = address 