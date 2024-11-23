const mongoose = require('mongoose')

const packageSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    dateCreatedAt: Date,
    dateUpdatedAt: Date,
    delivered: Boolean
})

packageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Package', packageSchema)