const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Paquete = require('../models/paquete')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are some paquetes', () => {
    beforeEach(async () => {
        await Paquete.deleteMany({})

        const paquetesObject = helper.packages.map(paquete => new Paquete(paquete))
        const promiseArray = paquetesObject.map(paquete => paquete.save())
        await Promise.all(promiseArray)
    })

    test('no paquetes are returned, get error', async () => {
        console.log('entered test');
          await api
              .get('/api/paquetes')
              .expect(404)
    })

    describe('addition of a new paquete', () => {
        test('succeeds with valid data', async () => {
            const newPaquete = {
              codigo: '4004',
              idDireccion: '673a6c54f8ca4f17dae0aa0e'
            }
            
            await api
              .post('/api/paquetes')
              .send(newPaquete)
              .expect(201)
              .expect('Content-Type', /application\/json/)
      
            const paquetesAtEnd = await helper.packagesInDb()
            
            assert.strictEqual(paquetesAtEnd.length, helper.packages.length + 1)
      
            const contents = paquetesAtEnd.map(n => n.codigo)
            assert(contents.includes('4004'))
          })

          test('fails with status code 400 if data invalid', async () => {
            const newPaquete = {
              entregado: false,
              idDireccion: '673a6c54f8ca4f17dae0aa0e'
            }
      
            await api
              .post('/api/paquetes')
              .send(newPaquete)
              .expect(400)
      
            const paquetesAtEnd = await helper.packagesInDb()
      
            assert.strictEqual(paquetesAtEnd.length, helper.packages.length)
          })
    })

    describe('deletion of a paquete', () => {
        test('succeeds with status code 204 if id is valid', async () => {
          const paquetesAtStart = await helper.packagesInDb()
          const paqueteToDelete = paquetesAtStart[0]
    
          await api
            .delete(`/api/paquetes/${paqueteToDelete.id}`)
            .expect(204)
    
          const paquetesAtEnd = await helper.packagesInDb()
    
          assert.strictEqual(paquetesAtEnd.length, helper.packages.length - 1)
          
          const contents = paquetesAtEnd.map(r => r.codigo)
          
          assert(!contents.includes(paqueteToDelete.codigo))
        })
      })
})

after(async () => {
    await mongoose.connection.close()
})