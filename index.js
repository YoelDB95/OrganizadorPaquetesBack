const express = require('express')
const cors = require('cors')
const app = express()
const {PORT, MONGODB_URI} = require('./config')
const Direccion = require('./direccion')
const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(e => console.log('Error connecting to MongoDB', e.message)
    )

app.use(express.json())
app.use(cors())

app.get('/api/direcciones', (request, response) => {
    Direccion.find({})
    .then(e => response.json(e))
    
})

app.post('/api/direccion', (request, response) => {
    const data = request.body
    const direccion = new Direccion({
        direccion: data.direccion,
        ciudad: data.ciudad
    })

    console.log(direccion);
    
    direccion.save().then(
        result => console.log(result)
    )
    
    return response.end()
    
})


app.listen(PORT, () => {
    console.log(`Litening at port ${PORT}`)
})
