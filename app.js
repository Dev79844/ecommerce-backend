const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use(morgan("tiny"))

const home = require('./routes/home')
const user = require('./routes/user')
const product = require('./routes/product')
const payment = require('./routes/payment')

app.use("/api/v1",home)
app.use("/api/v1",user)
app.use("/api/v1",product)
app.use("/api/v1",payment)

module.exports = app