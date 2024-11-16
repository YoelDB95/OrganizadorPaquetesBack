const mongoose = require('mongoose')
const {MONGODB_URI} = require('./config')

const direccionSchema = new mongoose.Schema({
    direccion: String,
    ciudad: String,
    entregado: Boolean,
    paquetes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paquete'
    }]
})

direccionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString().toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Direccion', direccionSchema)