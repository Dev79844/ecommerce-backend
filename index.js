const app = require('./app');
const connectDb = require('./config/db');
const cloudinary = require('cloudinary').v2
require('dotenv').config()

connectDb()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})