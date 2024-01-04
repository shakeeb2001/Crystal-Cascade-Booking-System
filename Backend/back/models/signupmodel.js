const mongoose = require('mongoose')

const SignupSchema = new mongoose.Schema({
    
    firstName: String,
    lastName: String,
    email:String,
    username:String,
    password:String

})

const SignupModel = mongoose.model("signup",SignupSchema)

module.exports = SignupModel