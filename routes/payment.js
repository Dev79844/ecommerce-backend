const express = require('express')
const {captureStripePayment,captureRazorpayPayment} = require('../controllers/paymentController')
const {isLoggedIn} = require('../middleware/user')

const router = express.Router()

router.post("/pay/stripe", isLoggedIn, captureStripePayment)
router.post("/pay/razor",isLoggedIn,captureRazorpayPayment)

module.exports = router