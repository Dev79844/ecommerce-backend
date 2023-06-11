const Product = require('../models/product')
const cloudinary = require('cloudinary').v2
const CustomError = require('../utils/customError')

exports.addProduct = async(req,res,next) => {
    try {
        let imageArray=[]

        if(!req.files){
            return next(new CustomError("Images required",400))
        }

        if(req.files){
            for(let index=0; index<req.files.photos.length; index++){
                let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath,{
                    folder:'product'
                })

                imageArray.push({
                    id: result.public_id,
                    secure_url: result.secure_url
                })
            }
        }

        req.body.photos = imageArray
        req.body.user = req.user.id

        const product = await Product.create(req.body);

        res.status(200).json({
            success:true,
            product
        })

    } catch (error) {
        throw error
    }
}