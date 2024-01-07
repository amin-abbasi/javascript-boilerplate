const Error = require('http-errors')
const MESSAGES = require('../middlewares/i18n/types')

const Sample = require('../models/sample')
const { handlerFn } = require('../utils/handler')

const exportResult = {
  // Create Sample
  create: handlerFn(async (req, res, next) => {
    const data = req.body
    const result = await Sample.add(data)

    // ---- Use Socket.io
    // const io: SocketIO.Server = req.app.get('io')
    // io.emit('someEvent', { someData: '...' })

    res.result = result
    next(res)
  }),

  // List all Sample
  list: handlerFn(async (req, res, next) => {
    const query = req.query
    const result = await Sample.list(query)
    res.result = result
    next(res)
  }),

  // Show Sample Details
  details: handlerFn(async (req, res, next) => {
    const sampleId = req.params.sampleId
    const result = await Sample.details(sampleId)
    res.result = result
    next(res)
  }),

  // Update Sample
  update: handlerFn(async (req, res, next) => {
    const sampleId = req.params.sampleId
    const result = await Sample.updateById(sampleId, req.body)
    res.result = result
    next(res)
  }),

  // Archive Sample (Soft Delete)
  archive: handlerFn(async (req, res, next) => {
    const sampleId = req.params.sampleId
    const result = await Sample.softDelete(sampleId)
    res.result = result
    next(res)
  }),

  // Delete Sample From DB
  delete: handlerFn(async (req, res, next) => {
    const sampleId = req.params.sampleId
    const result = await Sample.remove(sampleId)
    res.result = result
    next(res)
  }),

  // Secure Action For Sample
  secureAction: handlerFn(async (req, res, next) => {
    // Check User in Auth Header
    if (req.user.role !== 'admin')
      throw Error.Unauthorized(MESSAGES.USER_FORBIDDEN)

    const sampleId = req.params.sampleId
    const result = await Sample.details(sampleId)
    res.result = result
    next(res)
  })
}

module.exports = exportResult
