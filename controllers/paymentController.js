const stripe = require('stripe')(process.env.STRIPT_API_SECRET)

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