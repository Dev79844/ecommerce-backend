const express = require('express')
const {isLoggedIn, customRole}  = require('../middleware/user')
const {addProduct,getAllProducts,adminGetAllProducts,getProduct,adminUpdateProduct,adminDeleteProduct} = require("../controllers/productController")
const {addReview,deleteReview,getReviewsForProduct} = require('../controllers/reviewController')

const router = express.Router()

router.route("/products").get(getAllProducts)
router.get("/product/:id",getProduct)
router.route("/review").put(isLoggedIn,addReview).delete(isLoggedIn,deleteReview).get(isLoggedIn,getReviewsForProduct)


router.route("/admin/product/add").post(isLoggedIn,customRole('admin'),addProduct)
router.get("/admin/products", isLoggedIn, customRole('admin'),adminGetAllProducts)
router.put("/admin/product/:id", isLoggedIn, customRole('admin'),adminUpdateProduct)
router.delete("/admin/product/:id", isLoggedIn, customRole('admin'),adminDeleteProduct)
module.exports = router