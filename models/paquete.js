const mongoose = require('mongoose')

const paqueteSchema = new mongoose.Schema({
    codigo: String,
    fechaAgregado: Date,
    fechaActualizado: Date,
    entregado: Boolean
})

paqueteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Paquete', paqueteSchema)