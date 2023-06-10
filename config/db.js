const mongoose = require('mongoose')

const connectDb = () => {
    mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB connected!"))
    .catch(err => {
        console.log(err)
        process.exit(1)
    })
}

module.exports = connectDb