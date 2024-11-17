const express = require('express')
const cors = require('cors')
const app = express()
const {MONGODB_URI} = require('./utils/config')
const mongoose = require('mongoose')
const paquetesRouter = require('./controllers/paquetes')
const direccionesRouter = require('./controllers/direcciones')

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(e => console.log('Error connecting to MongoDB', e.message)
    )

app.use(express.json())
app.use(cors())

app.use('/api/paquetes', paquetesRouter)
app.use('/api/direcciones', direccionesRouter)

module.exports = app