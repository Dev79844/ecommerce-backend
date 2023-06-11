const User = require('../models/User')
const cookieToken = require('../utils/cookieToken')
const CustomError = require('../utils/customError')
const mailHelper = require('../utils/emailHelper')
const cloudinary = require('cloudinary').v2
const crypto = require('crypto')

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

    const forgotToken = user.getForgotPasswordToken()
    // console.log(forgotToken);

    await user.save({validateBeforeSave:false})

    const uri = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

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

exports.passwordReset = async(req,res,next) => {
    try {
        const token = req.params.token 

        // console.log(token);

        const enctoken = crypto.createHash('sha256').update(token).digest('hex')

        console.log(enctoken);

        const user = await User.findOne({
            forgotPasswordToken: enctoken
        })

        console.log(user);

        if(!user){
            // return next(new Error("Token invalid"))
            return next(new Error("Token invalid"))
        }

        if(req.body.password !== req.body.confPassword){
            return next(new CustomError("Passwords do not match",400))
        }

        user.password = req.body.password
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined 
        await user.save()

        cookieToken(user,res)
    } catch (error) {
        console.log(error);
    }
}

exports.getLoggedInUserDetails = async(req,res,next) => {
    try {
        const user = await User.findById(req.user.id)

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        throw error
    }
}

exports.changePassword = async(req,res,next) => {
    try {
        const userId = req.user.id

        const user = await User.findById(userId)

        const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword)

        console.log(isCorrectOldPassword);

        if(!isCorrectOldPassword){
            return next(new Error("old password is incorrect"))
        }

        user.password = req.body.password 
        await user.save()

        cookieToken(user,res)
    } catch (error) {
        throw error
    }
}

exports.updateUserDetails = async(req,res,next) => {
    try{

        const newData = {
            name: req.body.name,
            email: req.body.email
        }

        if(req.files){
            const user = await User.findById(req.user.id)
            const imageId = user.photo.id

            await cloudinary.uploader.destroy(imageId)

            let file = req.files.photo
            const result = await cloudinary.uploader.upload(file.tempFilePath,{
                folder: 'users',
                width: 150,
                crop: "scale"
            })

            newData.photo = {
                id: result.public_id,
                secure_url: result.secure_url
            }
        }
        
        const user = await User.findByIdAndUpdate(req.user.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            user
        })


    }catch(error){
        throw error
    }
}

exports.adminAllUsers = async(req,res,next) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        throw error
    }
}

exports.adminGetSingleUser = async(req,res,next) => {
    try {
        const userId = req.params.id 

        const user = await User.findById(userId)

        if(!user){
            return next(new CustomError("No user found",400))
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        throw error
    }
}

exports.adminUpdateSingleUser = async(req,res,next) => {
    try{

        const newData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
        
        const user = await User.findByIdAndUpdate(req.user.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            user
        })


    }catch(error){
        throw error
    }
}

exports.adminDeleteAUser = async(req,res,next) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user){
            return next(new CustomError("No user found",401))
        }
        const imageId = user.photo.id 
        await cloudinary.uploader.destroy(imageId)

        await user.remove()

        res.status(200).json({
            success:true,
            message:"User deleted"
        })
    } catch (error) {
        throw error
    }
}

exports.managerAllUsers = async(req,res,next) => {
    try {
        const users = (await User.find({role: 'user'}, '-password -__v'))
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        throw error
    }
}