const express = require('express')
const {isLoggedIn, customRole}  = require('../middleware/user')
const {addProduct,getAllProducts,adminGetAllProducts,getProduct} = require("../controllers/productController")

const router = express.Router()

router.route("/products").get(getAllProducts)
router.route("/product/:id",getProduct)

router.route("/admin/product/add").post(isLoggedIn,customRole('admin'),addProduct)
router.route("/admin/products", isLoggedIn, customRole('admin'),adminGetAllProducts)
module.exports = router