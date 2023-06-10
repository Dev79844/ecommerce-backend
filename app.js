const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
app.use(fileUpload())

app.use(morgan("tiny"))

const home = require('./routes/home')

app.use("/api/v1",home)

module.exports = app