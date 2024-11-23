const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        min: 5
    },
    dateCreatedAt: Date,
    dateUpdatedAt: Date,
    city: {
        type: String,
        required: true
    },
    delivered: Boolean,
    packages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    }]
}, { strictPopulate: false })

addressSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString().toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Address', addressSchema)