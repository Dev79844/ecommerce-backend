const stripe = require('stripe')(process.env.STRIPT_API_SECRET)
const crypto = require('crypto')

exports.captureStripePayment = async(req,res,next) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata:{
                integration_check: 'accept_a_payment'
            }
        });

        res.status(200).json({
            success:true,
            client_secret: paymentIntent.client_secret
        })
    } catch (error) {
        throw error
    }
}

exports.captureRazorpayPayment = async(req,res,next) => {
    try {
        const instance = new Razorpay({ key_id: process.env.RAZORPAY_API, key_secret: process.env.RAZORPAY_API_SECRET })

        const myorder = await instance.orders.create({
            amount: req.body.amount,
            currency: "INR",
            receipt: crypto.randomBytes(16).toString('hex'),
        })

        res.status(200).json({
            success:true,
            order: myorder
        })
    } catch (error) {
        throw error
    }
}