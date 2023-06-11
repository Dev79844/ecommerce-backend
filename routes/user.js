const express = require('express')
const {signup, login, logout, forgotPassword,passwordReset,getLoggedInUserDetails,changePassword,updateUserDetails,adminAllUsers,managerAllUsers,adminGetSingleUser, adminUpdateSingleUser, adminDeleteAUser}  = require('../controllers/userController')
const {isLoggedIn,customRole} = require('../middleware/user')

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.post("/forgotPassword",forgotPassword)
router.post("/password/reset/:token",passwordReset)
router.get("/userdashboard",isLoggedIn,getLoggedInUserDetails)
router.post("/password/update", isLoggedIn,changePassword)
router.post("/userdashboard/update",isLoggedIn,updateUserDetails)

router.get("/admin/users",isLoggedIn,customRole('admin'),adminAllUsers)
router.route("/admin/user/:id").get(isLoggedIn,customRole('admin'),adminGetSingleUser).put(isLoggedIn,customRole('admin'),adminUpdateSingleUser).delete(isLoggedIn,customRole('admin'),adminDeleteAUser)

router.get("/manager/users",isLoggedIn,customRole('admin','manager'),managerAllUsers)

module.exports = router 