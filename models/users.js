const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // 3.1 création du token
    token: String,
    lang : String
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel