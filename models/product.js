const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "PLease provide product name"],
        trim: true,
        maxlength: [120,"Product name should not be more than 120 characters"]
    },
    price:{
        type:Number,
        required: [true, "PLease provide product name"],
        maxlength: [6,"Product price should not be more than 6 digits"]
    },
    price:{
        type:String,
        required: [true, "PLease provide product description"]
    },
    photos:[
        {
            id:{
                type:String,
                required: true
            },
            secure_url:{
                type:String,
                required:true
            }
        }
    ],
    category: {
        type:String,
        required:[true, 'Please select from - short-sleeves, long-sleeves, sweat-shirts, hoodies'],
        enum:{
            values:[
                'short-sleeves',
                'long-sleeves',
                'sweat-shirts',
                'hoodies'
            ],
            message: 'Please select from - short-sleeves, long-sleeves, sweat-shirts, hoodies'
        }
    },
    brand:{
        type:String,
        required: [true, 'Please add a brand for clothing']
    },
    rating:{
        type:Number,
        default: 0
    },
    numberOfReviews: {
        type:Number,
        default: 0
    },
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref:'User',
                required: true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required: true,
                enum:{
                    values:[1,2,3,4,5],
                    message: 'Please enter a value between 1 to 5'
                }
            },

        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
}, {timestamps: true})

module.exports = mongoose.model('Product',productSchema)