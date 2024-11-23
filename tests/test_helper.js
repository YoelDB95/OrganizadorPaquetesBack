const Address = require('../models/address')
const Package = require('../models/package')

const addresses = [
    { 
        address: 'san martin 1415',
        city: 'Azul'
     },
    { 
        address: 'av marconi 1759',
        city: 'Tandil' 
    },
    {
        address: 'san amrtin 5245',
        city: 'Olavarria'
    }
]

const packages = [
    { 
        code: '1001',
        id: '673a6c54f8ca4f17dae0aa0e'
     },
    { 
        code: '2002',
    },
    { 
        code: '3003'
    }
]

const nonExistingIdAddress = async () => {
    const address = new Address({ address: 'willremovethissoon', city: 'random'})
    await address.save()
    await address.deleteOne()

    return address._id.toString()
}

const addressesInDb = async () => {
    const addresses = await Address.find({})
    return addresses.map(address => address.toJSON())
}

const nonExistingIdPackages = async () => {
    const package = new Package({ code: 'willremovethissoon', id: '673a6c54f8ca4f17dae0aa0e'})
    await package.save()
    await package.deleteOne()

    return package._id.toString()
}

const packagesInDb = async () => {
    const packages = await Package.find({})
    return packages.map(package => package.toJSON())
}

module.exports = {
    addresses, packages, nonExistingIdAddress, addressesInDb, nonExistingIdPackages, packagesInDb, 
}