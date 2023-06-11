const User = require('../models/User')
const CustomError = require('../utils/customError')
const jwt = require('jsonwebtoken')

exports.isLoggedIn = async(req,res,next) => {
    try {
        const token = req.cookies.token || req.headers['Authorization'].replace("Bearer","")

        // console.log(token);

        if(!token){
            return next(new Error("Login to access this page"))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)

        // console.log(req.user);

        next()
    } catch (error) {
        throw error
    }
}

exports.customRole = (...roles) => {
    // console.log(roles);
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new CustomError("Not authorized to access this resource",402))
        }
        next()
    }
}
