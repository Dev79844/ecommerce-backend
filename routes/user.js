const express = require('express')
const {signup, login, logout, forgotPassword,passwordReset}  = require('../controllers/userController')

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.post("/forgotPassword",forgotPassword)
router.post("/password/reset/:token",passwordReset)

module.exports = router