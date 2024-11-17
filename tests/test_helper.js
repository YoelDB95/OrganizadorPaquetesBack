const Direccion = require('../models/direccion')
const Paquete = require('../models/paquete')

const addresses = [
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

const packages = [
    { 
        codigo: '1001',
        id: '673a6c54f8ca4f17dae0aa0e'
     },
    { 
        codigo: '2002',
    },
    { 
        codigo: '3003'
    }
]

const nonExistingIdAddress = async () => {
    const direccion = new Direccion({ content: 'willremovethissoon', ciudad: 'random'})
    await direccion.save()
    await direccion.deleteOne()

    return direccion._id.toString()
}

const addressesInDb = async () => {
    const direcciones = await Direccion.find({})
    return direcciones.map(direccion => direccion.toJSON())
}

const nonExistingIdPackages = async () => {
    const paquete = new Paquete({ codigo: 'willremovethissoon', id: '673a6c54f8ca4f17dae0aa0e'})
    await paquete.save()
    await paquete.deleteOne()

    return paquete._id.toString()
}

const packagesInDb = async () => {
    const paquetes = await Paquete.find({})
    return paquetes.map(paquete => paquete.toJSON())
}

module.exports = {
    addresses, packages, nonExistingIdAddress, addressesInDb, nonExistingIdPackages, packagesInDb, 
}