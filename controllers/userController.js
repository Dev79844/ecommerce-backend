const user = require('../models/user')
const User = require('../models/user')
const cookieToken = require('../utils/cookieToken')
const CustomError = require('../utils/customError')
const mailHelper = require('../utils/emailHelper')
const cloudinary = require('cloudinary').v2

exports.signup = async(req,res,next) => {
    const {name,email,password} = req.body

    let result

    if(req.files){
        let file = req.files.photo
        result = await cloudinary.uploader.upload(file.tempFilePath,{
            folder: 'users',
            width: 150,
            crop: "scale"
        })
    }

    if(!email || !name || !password){
        return next(new CustomError('Name, email and password required',400))
    }

    const user = await User.create({
        name,
        email,
        password,
        photo:{
            id: result.public_id,
            secure_url: result.secure_url
        }
    })

    user.password = undefined

    cookieToken(user,res)
}

exports.login = async(req,res,next) => {
    const {email,password} = req.body 

    if(!email || !password){
        return next(new CustomError("Please provide email and password",400))
    }

    const user = await User.findOne({email})

    if(!user){
        return next(new CustomError("Email or password does not match or exist",400))
    }

    const isPasswordCorrect = user.isValidatedPassword(password)

    if(!isPasswordCorrect){
        return next(new CustomError("Email or password does not match or exist",400))
    }

    cookieToken(user,res)
}

exports.logout = async(req,res) => {
    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success: true,
        message:"Logout successful"
    })
}

exports.forgotPassword = async(req,res,next) => {
    const {email} = req.body 
    
    const user = await User.findOne({email})

    if(!user){
        return next(new CustomError("User not found",400))
    }

    const forgotToken = user.getForgotPasswordToken()

    await user.save({validateBeforeSave:false})

    const uri = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`

    const message = `Copy paste this uri and click enter \n\n ${uri}`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email",
            message
        })

        res.status(200).json({
            success:true,
            message:"Email sent successfully"
        })
    } catch (error) {
        user.forgotPasswordToken = undefined 
        user.forgotPasswordExpiry = undefined
        await user.save({validateBeforeSave: false})
        return next(new CustomError(error.message, 500))
    }
}
