const { errors } = require('celebrate')
const express    = require('express')
const router     = express.Router()

// Write all your routes for this entity ...

module.exports = (app) => {

  // Add Controllers
  const Sample = require('./controllers/sample')(app)

  // Add Validators
  const SampleValidator = require('./validators/sample')(app)


  // ---------------------------------- Define all routes in this microservice ----------------------------------
  // Healthcheck Endpoint
  router.get('/healthcheck', SampleValidator.healthcheck, (req, res) => { res.send('200') })

  // Home Page - for testing purposes
  router.get('/v1/home', SampleValidator.home, (req, res) => { res.send('Hello!') })

  // (1) Use controller functions:
  router.post('/v1/samples', SampleValidator.create, Sample.create)
  router.get('/v1/samples', SampleValidator.list, Sample.list)
  router.get('/v1/samples/:sampleId', SampleValidator.details, Sample.details)
  router.put('/v1/samples/:sampleId', SampleValidator.update, Sample.update)
  router.patch('/v1/samples/:sampleId', SampleValidator.update, Sample.update)
  router.delete('/v1/samples/:sampleId', SampleValidator.delete, Sample.delete)

  app.use(errors())
  return router
}
