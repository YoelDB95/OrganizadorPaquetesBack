const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Package = require('../models/package')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are some packages', () => {
    beforeEach(async () => {
        await Package.deleteMany({})

        const paquetesObject = helper.packages.map(package => new Package(package))
        const promiseArray = paquetesObject.map(package => package.save())
        await Promise.all(promiseArray)
    })

    test('no packages are returned, get error', async () => {
        console.log('entered test');
          await api
              .get('/api/packages')
              .expect(404)
    })

    describe('addition of a new package', () => {
        test('succeeds with valid data', async () => {
            const newPackage = {
              code: '4004',
              idAddress: '673a6c54f8ca4f17dae0aa0e'
            }
            
            await api
              .post('/api/packages')
              .send(newPackage)
              .expect(201)
              .expect('Content-Type', /application\/json/)
      
            const packagesAtEnd = await helper.packagesInDb()
            
            assert.strictEqual(packagesAtEnd.length, helper.packages.length + 1)
      
            const contents = packagesAtEnd.map(n => n.code)
            assert(contents.includes('4004'))
          })

          test('fails with status code 400 if data invalid', async () => {
            const newPackage = {
              delivered: false,
              idAddress: '673a6c54f8ca4f17dae0aa0e'
            }
      
            await api
              .post('/api/packages')
              .send(newPackage)
              .expect(400)
      
            const packagesAtEnd = await helper.packagesInDb()
      
            assert.strictEqual(packagesAtEnd.length, helper.packages.length)
          })
    })

    describe('deletion of a package', () => {
        test('succeeds with status code 204 if id is valid', async () => {
          const packagesAtStart = await helper.packagesInDb()
          const packageToDelete = packagesAtStart[0]
    
          await api
            .delete(`/api/packages/${packageToDelete.id}`)
            .expect(204)
    
          const packagesAtEnd = await helper.packagesInDb()
    
          assert.strictEqual(packagesAtEnd.length, helper.packages.length - 1)
          
          const contents = packagesAtEnd.map(r => r.code)
          
          assert(!contents.includes(packageToDelete.code))
        })
      })
})

after(async () => {
    await mongoose.connection.close()
})