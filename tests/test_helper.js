const Direccion = require('../models/direccion')

const direcciones = [
    { 
        direccion: 'san martin 1415',
        ciudad: 'Azul'
     },
    { 
        direccion: 'av marconi 1759',
        ciudad: 'Tandil' 
    },
    {
        direccion: 'san amrtin 5245',
        ciudad: 'Olavarria'
    }
]

const nonExistingId = async () => {
    const direccion = new Direccion({ content: 'willremovethissoon', ciudad: 'random'})
    await direccion.save()
    await direccion.deleteOne()

    return direccion._id.toString()
}

const direccionesInDb = async () => {
    const direcciones = await Direccion.find({})
    return direcciones.map(direccion => direccion.toJSON())
}

module.exports = {
    direcciones, nonExistingId, direccionesInDb
}