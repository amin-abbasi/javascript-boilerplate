const boom = require('@hapi/boom')

module.exports = (app) => {

  const Sample = require('../models/sample')(app)

  // Controller Action for Sample Entity
  return {
    // Create Sample
    create(req, res, next) {
      const data = req.body
      return Sample.create(data)
        .then((result) => {
          console.log(' --------------- Create Result: ', result)
          res.result = result
          next(res)
        })
        .catch(err => { console.log(' --------------- Create Error: ', err); next(err) })
    },

    // List all Sample
    list(req, res, next) {
      return Sample.list()
        .then((result) => {
          res.result = result
          next(res)
        })
        .catch(err => { console.log(' --------------- List Error: ', err); next(err) })
    },

    // Show Sample Details
    details(req, res, next) {
      return Sample.details(req.params.sampleId)
        .then((result) => {
          console.log(' --------------- Details Result: ', result)
          res.result = result
          next(res)
        })
        .catch(err => { console.log(' --------------- Details Error: ', err); next(err) })
    },

    // Update Sample
    update(req, res, next) {
      const sampleId = req.params.sampleId
      return Sample.updateById(sampleId, req.body)
        .then((result) => {
          console.log(' --------------- Update Result: ', result)
          res.result = result
          next(res)
        })
        .catch(err => { console.log(' --------------- Update Error: ', err); next(err) })
    },

    // Delete Sample
    delete(req, res, next) {
      const sampleId = req.params.sampleId
      return Sample.delete(sampleId)
        .then((result) => {
          console.log(' --------------- Delete Result: ', result)
          res.result = result
          next(res)
        })
        .catch(err => { console.log(' --------------- Delete Error: ', err); next(err) })
    }
  }
}
