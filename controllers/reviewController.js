const Product = require('../models/product')

exports.addReview = async(req,res,next) => {
    try {
        const {rating,comment,productId} = req.body 
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        let product = await Product.findById(productId)

        const alreadyReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        )

        if(alreadyReviewed){
            product.reviews.forEach((review) => {
                if(review.user.toString() === req.user._id.toString()){
                    review.comment = comment
                    review.rating = rating
                }
            })
        }else{
            product.reviews.push(review)
            product.numberOfReviews = product.reviews.length
        }

        product.rating = product.reviews.reduce((acc,item) => item.rating + acc,0) / product.reviews.length

        await product.save({validateBeforeSave:true})

        res.status(200).json({
            success:true,
            message:"Review added"
        })

    } catch (error) {
        throw error
    }
}

exports.deleteReview = async(req,res,next) =>{
    try {
        const {productId} = req.query
        const product = await Product.findById(productId)

        const reviews = product.reviews.filter((rev) => rev.user.toString() === req.user._id)

        const numberOfReviews = reviews.length

        const rating = product.reviews.reduce((acc,item) => item.rating + acc,0) / reviews.length

        await Product.findByIdAndUpdate(productId,{
            reviews,
            rating,
            numberOfReviews
        },{new:true})


    } catch (error) {
        throw error
    }
}

exports.getReviewsForProduct = async(req,res,next) => {
    try {
        const product = await Product.findById(req.query.id)
        res.status(200).json({
            success:true,
            reviews: product.reviews
        })
    } catch (error) {
        throw error
    }
}