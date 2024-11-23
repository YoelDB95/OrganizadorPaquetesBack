const packagesRouter = require('express').Router()
const Package = require('../models/package')
const Address = require('../models/address')

packagesRouter.post('/', (request, response, next) => {
    const body = request.body

    if (!body.idAddress)
        return response.status(400).json({ error: 'Identifier of address is missing' })
    
    const newPackage = new Package({
        code: body.code,
        dateCreatedAt: new Date(),
        dateUpdatedAt: new Date(),
        delivered: false
    })

    newPackage.save()
        .then(result => {
            console.log(result);
        
            Address.findByIdAndUpdate(
                body.idAddress, 
                { $push: { packages: result._id } }, 
                { new: true }
            )
                .then(re => {
                    response.status(201).json({result, re})  
                })
                .catch(e => next(e))
        })
        .catch(e => next(e))
})

packagesRouter.put('/:id', (request, response, next) => {
    // controlar que no se cambie el codigo

    const body = request.body

    const package = {
        dateUpdatedAt: new Date(),
        delivered: body.delivered
    }

    Paquete.findByIdAndUpdate(request.params.id, package, {new: true})
    .then(result => response.json(result))
    .catch(e => next(e))
})

packagesRouter.delete('/:id', (request, response, next) => {
    Package.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(e => next(e))
})


module.exports = packagesRouter