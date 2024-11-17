const direccionesRouter = require('express').Router()
const Direccion = require('../models/direccion')

direccionesRouter.get('/', (request, response) => {
    Direccion.find({})
    .populate({
        path: 'paquetes',
        match: { entregado: false }
    })
    .then(e => response.json(e))    
})

direccionesRouter.post('/', (request, response) => {
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

module.exports = direccionesRouter