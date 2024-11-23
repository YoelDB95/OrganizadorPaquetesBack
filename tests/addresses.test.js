const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Address = require('../models/address')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are some addresses', () => {
    beforeEach(async () => {
        await Address.deleteMany({})

        const addressObject = helper.addresses.map(address => new Address(address))
        const promiseArray = addressObject.map(address => address.save())
        await Promise.all(promiseArray)
    })

    test('addresses are returned as json', async () => {
        console.log('entered test');
          await api
              .get('/api/addresses')
              .expect(200)
              .expect('Content-Type', /application\/json/)
    })

    test('all addresses are returned', async () => {
        const response = await api.get('/api/addresses')
    
        assert.strictEqual(response.body.length, helper.addresses.length)
    })

    test('a specific direccion is within the returned notes', async () => {
        const response = await api.get('/api/addresses')
    
        const contents = response.body.map(e => e.address)
        assert(contents.includes('san martin 1415'))
    })

    describe('addition of a new address', () => {
        test('succeeds with valid data', async () => {
            const newAddress = {
              address: 'async/await simplifies making async calls',
              city: "true",
            }
      
            await api
              .post('/api/addresses')
              .send(newAddress)
              .expect(201)
              .expect('Content-Type', /application\/json/)
      
            const addressesAtEnd = await helper.addressesInDb()
            
            assert.strictEqual(addressesAtEnd.length, helper.addresses.length + 1)
      
            const contents = addressesAtEnd.map(n => n.address)
            assert(contents.includes('async/await simplifies making async calls'))
          })

          test('fails with status code 400 if data invalid', async () => {
            const newAddress = {
              address: 'direcccion'
            }
      
            await api
              .post('/api/addresses')
              .send(newAddress)
              .expect(400)
      
            const addressesAtEnd = await helper.addressesInDb()
      
            assert.strictEqual(addressesAtEnd.length, helper.addresses.length)
          })
    })

    describe('deletion of an address', () => {
        test('succeeds with status code 204 if id is valid', async () => {
          const addressesAtStart = await helper.addressesInDb()
          const addressesToDelete = addressesAtStart[0]
    
          await api
            .delete(`/api/addresses/${addressesToDelete.id}`)
            .expect(204)
    
          const addressesAtEnd = await helper.addressesInDb()
    
          assert.strictEqual(addressesAtEnd.length, helper.addresses.length - 1)
    
          const contents = addressesAtEnd.map(r => r.address)
          assert(!contents.includes(addressesToDelete.address))
        })
      })
})

after(async () => {
    await mongoose.connection.close()
})