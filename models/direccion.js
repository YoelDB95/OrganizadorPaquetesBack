const mongoose = require('mongoose')

const direccionSchema = new mongoose.Schema({
    direccion: {
        type: String,
        required: true,
        min: 5
    },
    ciudad: {
        type: String,
        required: true
    },
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