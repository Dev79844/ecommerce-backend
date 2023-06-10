const user = require('../models/user')
const User = require('../models/user')
const cookieToken = require('../utils/cookieToken')
const CustomError = require('../utils/customError')
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