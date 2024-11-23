const addressesRouter = require('express').Router()
const Address = require('../models/address')

addressesRouter.get('/', (request, response, next) => {
    Address.find({})
    .populate({
        path: 'package',
        match: { entregado: false }
    })
    .then(result => response.status(200).json(result))    
})

addressesRouter.post('/', (request, response, next) => {
    const data = request.body
    const address = new Address({
        address: data.address,
        city: data.city
    })

    
    address.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(e => next(e))    
})

addressesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    if (!body.delivered)
        return response.status(400).json({ error: 'Delivered is missing'})

    const address = {
        address: body.address,
        dateUpdatedAt: new Date(),
        delivered: body.delivered
    }

    Address
        .findByIdAndUpdate(request.params.id, address, { new: true })
        .then(result => response.json(result))
        .catch(e => next(e))
})

addressesRouter.delete('/:id', (request, response, next) => {
    Address.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(e => next(e))
})

module.exports = addressesRouter