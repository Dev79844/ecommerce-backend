const express = require('express')
const {isLoggedIn, customRole}  = require('../middleware/user')

const router = express.Router()

module.exports = router