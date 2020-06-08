const mongoose = require('mongoose')
const _        = require('lodash')
const Boom     = require('@hapi/boom')
// const uniqueV  = require('mongoose-unique-validator')

module.exports = (app) => {

  const Schema   = mongoose.Schema
  const ObjectId = Schema.Types.ObjectId

  // Add your own attributes in schema
  const schema = new Schema({
    // name: { type: String, required: true, unique: true },
    any: Schema.Types.Mixed,    // An "anything goes" SchemaType

    // Advanced Property type schema
    location: {
      type: {
        _id: false,
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
    deletedAt: { type: Schema.Types.Number, default: null },

    // , ... other properties ...
  },
  {
    strict: false,  // To allow database in order to save Mixed type data in DB
    // timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  })

  // Apply the Unique Property Validator plugin to schema.
  // schema.plugin(uniqueV, { message: 'Error, expected "{PATH}" to be unique.' })

  // ------------------------------------- Set Hooks (like: 'pre') for Schema -------------------------------------

  // schema.pre('save', function(next) {
  //   ... Code Here ...
  //   next()
  // })

  // Flatten model to update (patch) partial data
  // schema.pre('findOneAndUpdate', function() {
  //   this._update = flat(this._update)
  // })


  // Choose your own model name
  const modelName = (mongoose.models && mongoose.models.ModelName) ? mongoose.models.ModelName : mongoose.model('ModelName', schema)

  return class ModelName extends modelName {

    // Options i.e.: { checkKeys: false }
    static create(data, options) {
      const modelName = new ModelName({ ...data, createdAt: new Date().getTime() })
      return options ? modelName.save(options) : modelName.save()
    }

    static details(modelNameId) {
      return ModelName.findById(modelNameId)
        .then(modelName => {
          if(!modelName || modelName._doc.deletedAt) throw Boom.notFound('ModelName not found.')
          return modelName._doc
        })
    }

    static list(query) {
      if(!query) query = {}
      query.deletedAt = null
      return ModelName.find(query)
        .then(result => {
          return {
            total: result.length,
            list: result
          }
        })
    }

    static update(query, data) {
      return ModelName.findOneAndUpdate(query, { ...data, updatedAt: new Date().getTime() }, { new: true })
    }

    static updateById (modelNameId, data) {
      return this.details(modelNameId)
        .then((modelName) => {
          _.merge(modelName, data)
          modelName.updatedAt = new Date().getTime()
          return ModelName.findByIdAndUpdate(modelNameId, modelName, { new: true })
        })
    }

    static delete(modelNameId) {
      return this.details(modelNameId)
        .then(() => {
          return ModelName.findByIdAndUpdate(modelNameId, { deletedAt: new Date().getTime() }, { new: true })
        })
    }

    static restore(modelNameId) {
      return this.details(modelNameId)
        .then(() => {
          return ModelName.findByIdAndUpdate(modelNameId, { deletedAt: null }, { new: true })
        })
    }
  }

}

// --------------- Swagger Models Definition ---------------
/**
 * @typedef Sample
 * @property {string} userId.required - User ID
 * @property {string} name.required - Sample Name
 * @property {string} description.required - Some description for sample
 * @property {integer} age - Some description for age - eg: 32
 * @property {Array.<Client>} clients.required - List of clients participating in this sample
 */

/**
 * @typedef Client
 * @property {integer} name.required - Client name - eg: Moshanir Co.
 * @property {integer} logoUrl - Client logo Url link
 * @property {string} color
 * @property {enum} status - Status values that need to be considered for filter - eg: available,pending
 */
