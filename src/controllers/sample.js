const Boom   = require('@hapi/boom')
const Sample = require('../models/sample')

const exportResult = {

  // Create Sample
  async create(req, res, next) {
    try {
      const data = req.body
      const result = await Sample.add(data)

      // ---- Use Socket.io
      // const io: SocketIO.Server = req.app.get('io')
      // io.emit('someEvent', { someData: '...' })

      res.result = result
      next(res)
    } catch (err) { next(err) }
  },

  // List all Sample
  async list(req, res, next) {
    try {
      const query = req.query
      const result = await Sample.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Show Sample Details
  async details(req, res, next) {
    try {
      const sampleId = req.params.sampleId
      const result = await Sample.details(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Update Sample
  async update(req, res, next) {
    try {
      const sampleId = req.params.sampleId
      const result = await Sample.updateById(sampleId, req.body)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Archive Sample (Soft Delete)
  async archive(req, res, next) {
    try {
      const sampleId = req.params.sampleId
      const result = await Sample.softDelete(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Delete Sample From DB
  async delete(req, res, next) {
    try {
      const sampleId = req.params.sampleId
      const result = await Sample.remove(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Secure Action For Sample
  async secureAction(req, res, next) {
    try {
      // Check User in Auth Header
      if(req.user.role !== 'admin') throw Boom.unauthorized('Invalid User.')

      const sampleId = req.params.sampleId
      const result = await Sample.details(sampleId)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

}

module.exports = exportResult