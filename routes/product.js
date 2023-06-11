const express = require('express')
const {isLoggedIn, customRole}  = require('../middleware/user')
const {addProduct,getAllProducts} = require("../controllers/productController")

const router = express.Router()

router.route("/products").get(getAllProducts)

router.route("/admin/product/add").post(isLoggedIn,customRole('admin'),addProduct)

module.exports = router