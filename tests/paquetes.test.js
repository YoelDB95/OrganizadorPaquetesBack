const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Direccion = require('../models/direccion')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are some direcciones', () => {
    beforeEach(async () => {
        await Direccion.deleteMany({})

        const direccionObject = helper.direcciones.map(direccion => new Direccion(direccion))
        const promiseArray = direccionObject.map(direccion => direccion.save())
        await Promise.all(promiseArray)
    })

    test('direcciones are returned as json', async () => {
        console.log('entered test');
          await api
              .get('/api/direcciones')
              .expect(200)
              .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const response = await api.get('/api/direcciones')
    
        assert.strictEqual(response.body.length, helper.direcciones.length)
    })

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/direcciones')
    
        const contents = response.body.map(e => e.direccion)
        assert(contents.includes('san martin 1415'))
    })

    describe('addition of a new note', () => {
        test('succeeds with valid data', async () => {
            const newDireccion = {
              direccion: 'async/await simplifies making async calls',
              ciudad: "true",
            }
      
            await api
              .post('/api/direcciones')
              .send(newDireccion)
              .expect(201)
              .expect('Content-Type', /application\/json/)
      
            const direccionesAtEnd = await helper.direccionesInDb()
            
            assert.strictEqual(direccionesAtEnd.length, helper.direcciones.length + 1)
      
            const contents = direccionesAtEnd.map(n => n.direccion)
            assert(contents.includes('async/await simplifies making async calls'))
          })

          test('fails with status code 400 if data invalid', async () => {
            const newDireccion = {
              direccion: 'direcccion'
            }
      
            await api
              .post('/api/direcciones')
              .send(newDireccion)
              .expect(400)
      
            const direccionesAtEnd = await helper.direccionesInDb()
      
            assert.strictEqual(direccionesAtEnd.length, helper.direcciones.length)
          })
    })

    describe('deletion of a note', () => {
        test('succeeds with status code 204 if id is valid', async () => {
          const direccionesAtStart = await helper.direccionesInDb()
          const direccionToDelete = direccionesAtStart[0]
    
          await api
            .delete(`/api/direcciones/${direccionToDelete.id}`)
            .expect(204)
    
          const direccionesAtEnd = await helper.direccionesInDb()
    
          assert.strictEqual(direccionesAtEnd.length, helper.direcciones.length - 1)
    
          const contents = direccionesAtEnd.map(r => r.direccion)
          assert(!contents.includes(direccionToDelete.direccion))
        })
      })
})

after(async () => {
    await mongoose.connection.close()
})