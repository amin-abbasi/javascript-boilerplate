const mongoose = require('mongoose')
const uniqueV = require('mongoose-unique-validator')
const Error = require('../services/http_errors')
const { mergeDeep } = require('../services/methods')
const MESSAGES = require('../middlewares/i18n/types')

const Schema = mongoose.Schema

// Add your own attributes in schema
const schema = new Schema({
  name: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, unique: true },
  any: Schema.Types.Mixed, // An "anything goes" SchemaType

  // Advanced Property type schema
  location: {
    type: {
      _id: false,
      country: { type: Schema.Types.String, required: true },
      city: { type: Schema.Types.String, required: true },
      address: { type: Schema.Types.String },
      coordinate: {
        type: {
          _id: false,
          lat: Schema.Types.Number,
          lon: Schema.Types.Number
        }
      }
    },
    required: true
  },

  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 }
})

// Apply the Unique Property Validator plugin to schema.

schema.plugin(uniqueV, {
  type: 'mongoose-unique-validator',
  message: 'Error, expected {PATH} to be unique.'
})

// Choose your own model name
const Model = mongoose.model('Model_Name', schema)

async function add(data) {
  const modelData = {
    ...data,
    createdAt: Date.now()
  }
  return await Model.create(modelData)
}

async function list(queryData) {
  const { page, size, ...query } = queryData

  // if(query.dateRange) {
  //   query.createdAt = {}
  //   if(query.dateRange.from) query.createdAt['$gte'] = query.dateRange.from
  //   if(query.dateRange.to)   query.createdAt['$lte'] = query.dateRange.to
  //   delete query.dateRange
  // }
  // if(query.name) query.name = { '$regex': query.name, '$options': 'i' }

  const total = await Model.countDocuments({ deletedAt: 0 })
  const result = await Model.find(query)
    .limit(size)
    .skip((page - 1) * size)
  return {
    total: total,
    list: result
  }
}

async function details(modelId) {
  const model = await Model.findById(modelId)
  if (!model || model.deletedAt !== 0)
    throw Error.NotFound(MESSAGES.MODEL_NOT_FOUND)
  return model
}

async function updateByQuery(query, data) {
  const updatedData = { ...data, updatedAt: Date.now() }
  return await Model.findOneAndUpdate(query, updatedData, { new: true })
}

async function updateById(modelId, data) {
  const model = await details(modelId)
  model.updatedAt = Date.now()
  const updatedModel = mergeDeep(model, data)
  return await Model.findByIdAndUpdate(modelId, updatedModel, { new: true })
}

async function softDelete(modelId) {
  const model = await details(modelId)
  return await Model.findByIdAndUpdate(
    model.id,
    { deletedAt: Date.now() },
    { new: true }
  )
}

async function remove(modelId) {
  const model = await details(modelId)
  return await Model.deleteOne({ _id: model.id })
}

async function restore(modelId) {
  const model = await details(modelId)
  return await Model.findByIdAndUpdate(
    model.id,
    { deletedAt: 0 },
    { new: true }
  )
}

module.exports = {
  add,
  list,
  details,
  updateById,
  updateByQuery,
  softDelete,
  remove,
  restore
}

// --------------- OpenAPI Models Definition ---------------

/**
 * @openapi
 * components:
 *   schemas:
 *     Sample:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *           description: Email for the user, needs to be unique.
 *       example:
 *         name: 'Amin'
 *         email: 'amin@gmail.com'
 */
