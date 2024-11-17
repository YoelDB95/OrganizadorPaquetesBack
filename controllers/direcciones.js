const direccionesRouter = require('express').Router()
const Direccion = require('../models/direccion')

direccionesRouter.get('/', (request, response, next) => {
    Direccion.find({})
    .populate({
        path: 'paquetes',
        match: { entregado: false }
    })
    .then(result => response.status(200).json(result))    
})

direccionesRouter.post('/', (request, response, next) => {
    const data = request.body
    const direccion = new Direccion({
        direccion: data.direccion,
        ciudad: data.ciudad
    })

    console.log(direccion);
    
    direccion.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(e => next(e))    
})

direccionesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    if (!body.entregado)
        return response.status(400).json({ error: 'Entregado is missing'})

    const direccion = {
        direccion: body.direccion,
        fechaActualizacion: new Date(),
        entregado: body.entregado() // verificar que entregado exista
    }

    Direccion
        .findByIdAndUpdate(request.params.id, direccion, { new: true })
        .then(result => response.json(result))
        .catch(e => next(e))
})

direccionesRouter.delete('/:id', (request, response, next) => {
    Direccion.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(e => next(e))
})

module.exports = direccionesRouter