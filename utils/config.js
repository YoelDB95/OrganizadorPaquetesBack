require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.MONGODB

module.exports = {
    PORT, 
    MONGODB_URI
}