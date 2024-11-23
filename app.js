const express = require('express')
const cors = require('cors')
const app = express()
const {MONGODB_URI} = require('./utils/config')
const mongoose = require('mongoose')
const packagesRouter = require('./controllers/packages')
const addressesRouter = require('./controllers/addresses')
const middleware = require('./utils/middleware')

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(e => console.log('Error connecting to MongoDB', e.message)
    )

app.use(express.json())
app.use(cors())

app.use('/api/packages', packagesRouter)
app.use('/api/addresses', addressesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app