const mongoose = require('mongoose')
const Boom     = require('@hapi/boom')
const uniqueV  = require('mongoose-unique-validator')
const { mergeDeep } = require('../services/methods')

const Schema = mongoose.Schema

// Add your own attributes in schema
const schema = new Schema({
  name:  { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, unique: true },
  any: Schema.Types.Mixed,    // An "anything goes" SchemaType

  // Advanced Property type schema
  location: {
    type: {
      _id: false,
      country: { type: Schema.Types.String, required: true },
      city:    { type: Schema.Types.String, required: true },
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
  deletedAt: { type: Schema.Types.Number, default: 0 },
})

// Apply the Unique Property Validator plugin to schema.

schema.plugin(uniqueV, {
  type: 'mongoose-unique-validator',
  message: 'Error, expected {PATH} to be unique.'
})

// Choose your own model name
const ModelName = mongoose.model('ModelName', schema)

async function add(data) {
  const modelNameData = {
    ...data,
    createdAt: new Date().getTime()
  }
  return await ModelName.create(modelNameData)
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

  const total = await ModelName.countDocuments({ deletedAt: 0 })
  const result = await ModelName.find(query).limit(size).skip((page - 1) * size)
  return {
    total: total,
    list: result
  }
}

async function details(modelNameId) {
  const modelName = await ModelName.findById(modelNameId)
  if(!modelName || modelName.deletedAt !== 0) throw Boom.notFound('ModelName not found.')
  return modelName
}

async function updateByQuery(query, data) {
  const updatedData = { ...data, updatedAt: new Date().getTime() }
  return await ModelName.findOneAndUpdate(query, updatedData, { new: true })
}

async function updateById(modelNameId, data) {
  const modelName = await details(modelNameId)
  modelName.updatedAt = new Date().getTime()
  const updatedModelName = mergeDeep(modelName, data)
  return await ModelName.findByIdAndUpdate(modelNameId, updatedModelName, { new: true })
}

async function softDelete(modelNameId) {
  const modelName = await details(modelNameId)
  return await ModelName.findByIdAndUpdate(modelName.id, { deletedAt: new Date().getTime() }, { new: true })
}

async function remove(modelNameId) {
  const modelName = await details(modelNameId)
  return await ModelName.deleteOne({ _id: modelName.id })
}

async function restore(modelNameId) {
  const modelName = await details(modelNameId)
  return await ModelName.findByIdAndUpdate(modelName.id, { deletedAt: 0 }, { new: true })
}

module.exports = { add, list, details, updateById, updateByQuery, softDelete, remove, restore }

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
