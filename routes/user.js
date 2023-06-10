const express = require('express')
const {signup, login, logout, forgotPassword}  = require('../controllers/userController')

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.post("/forgotPassword",forgotPassword)

module.exports = router