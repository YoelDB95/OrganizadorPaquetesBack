const express = require('express')
const cors = require('cors')
const app = express()
const {PORT, MONGODB_URI} = require('./config')
const mongoose = require('mongoose')
const Direccion = require('./direccion')
const Paquete = require('./paquete')

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
    .populate({
        path: 'paquetes',
        match: { entregado: false }
    })
    .then(e => response.json(e))    
})

app.post('/api/direcciones', (request, response) => {
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

app.get('/api/paquetes', (request, response) => {
    Paquete.find({})
    .then(result => response.json(result))
    .catch(e => response.json(e))
})

app.post('/api/paquetes', (request, response) => {
    const body = request.body
    const newPaquete = new Paquete({
        codigo: body.codigo,
        fechaAgregado: new Date(),
        fechaActualizado: new Date(),
        entregado: false
    })

    newPaquete.save().then(result => {
        console.log(result);
        
        Direccion.findByIdAndUpdate(
            body.idDireccion, 
            { $push: { paquetes: result._id } }, 
            { new: true }
        )
            .then(re => {
                response.status(201).json(result)  
            })
            .catch(e => {return response.status(400).json(e)})
    })
    .catch(e => response.status(400).json(e))
})

app.put('/api/paquetes/:id', (request, response) => {
    // controlar que no se cambie el codigo

    const body = request.body

    const paquete = {
        fechaActualizado: new Date(),
        entregado: body.entregado
    }

    Paquete.findByIdAndUpdate(request.params.id, paquete, {new: true})
    .then(result => response.json(result))
    .catch(e => response.status(400).json(e))
})

app.delete('/api/paquetes/:id', (request, response) => {
    Paquete.findByIdAndDelete(request.params.id)
    .then(result => response.json('Paquete deleted'))
    .catch(e => response.status(400).json(e))
})

app.listen(PORT, () => {
    console.log(`Litening at port ${PORT}`)
})
