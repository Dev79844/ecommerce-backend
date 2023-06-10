const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please provide a name"]
    },
    email:{
        type:String,
        required: [true, "Please provide an email"],
        validate: [validator.isEmail, "Please provide a valid email"],
        unique: true
    },
    password:{
        type:String,
        required: [true,'Please provide a password'],
        minlength: [6, "Password should be atleast 6 character long"]
    },
    role:{
        type:String,
        default: 'user',
    },
    photo:{
        id:{
            type:String,
            required: true
        },
        secure_url:{
            type:String,
            required:true
        }
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry: Date
}, {timestamps: true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isValidatedPassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password)
}

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

userSchema.methods.getForgotPasswordToken = function(){
    const forgotToken = crypto.randomBytes(20).toString('hex')

    //make sure to get hash on backend
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')

    this.forgotPasswordExpiry = Date.now() + 20*60*1000

    return forgotToken
}

module.exports = mongoose.model('User',userSchema)