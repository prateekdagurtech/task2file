const mongoose = require('mongoose')
const { Schema } = mongoose;
const addressSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    address: {
        type: String,
        required: true,
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
const address = mongoose.model('address', addressSchema)
module.exports = address 