const paquetesRouter = require('express').Router()
const Paquete = require('../models/paquete')

paquetesRouter.get('/', (request, response) => {
    Paquete.find({})
    .then(result => response.json(result))
    .catch(e => next(e))
})

paquetesRouter.post('/', (request, response) => {
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
                response.status(201).json({result, re})  
            })
            .catch(e => next(e))
    })
    .catch(e => next(e))
})

paquetesRouter.put('/:id', (request, response) => {
    // controlar que no se cambie el codigo

    const body = request.body

    const paquete = {
        fechaActualizado: new Date(),
        entregado: body.entregado
    }

    Paquete.findByIdAndUpdate(request.params.id, paquete, {new: true})
    .then(result => response.json(result))
    .catch(e => next(e))
})

paquetesRouter.delete('/:id', (request, response) => {
    Paquete.findByIdAndDelete(request.params.id)
    .then(result => response.json('Paquete deleted'))
    .catch(e => next(e))
})


module.exports = paquetesRouter