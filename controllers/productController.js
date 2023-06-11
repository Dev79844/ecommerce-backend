const Product = require('../models/product')
const cloudinary = require('cloudinary').v2
const CustomError = require('../utils/customError')
const WhereClause = require('../utils/whereClause')

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

exports.getAllProducts = async(req,res,next) => {
    try {
        const resultperpage = 6
        const totalProducts = await Product.countDocuments()

        const productsObj = new WhereClause(Product.find(),req.query).search().filter()

        let products = await productsObj.base

        const filteredProductcount = products.length

        productsObj.pager(resultperpage)

        products = await productsObj.base.clone()

        res.status(200).json({
            success: true,
            products,
            filteredProductcount,
            totalProducts
        })

    } catch (error) {
        throw error
    }
}

exports.getProduct = async(req,res,next) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return next(new CustomError("No product found",401))
        }

        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        throw error
    }
}

exports.adminGetAllProducts = async(req,res,next) => {
    try {
        
        const products = await Product.find({})

        res.status(200).json({
            success: true,
            products
        })

    } catch (error) {
        throw error
    }
}