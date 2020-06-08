const { celebrate, Joi } = require('celebrate')
const _      = require('lodash')
Joi.objectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/)

module.exports = {

  // Create new Sample
  create: celebrate({
    // body: {
    //   name: Joi.string().required().description('User Name'),
    //   userId: Joi.objectId().required().description('User ID')
    // },
    query: {}
  }),

  // List All Samples
  list: celebrate({
    query: {}
  }),

  // Show Sample Details
  details: celebrate({
    params: {
      sampleId: Joi.objectId().required().description('Sample ID')
    },
    query: {}
  }),

  // Update Sample
  update: celebrate({
    // body: {
    //   name: Joi.string().description('User Name'),
    //   userId: Joi.objectId().required().description('User ID')
    // },
    params: {
      sampleId: Joi.objectId().required().description('Sample ID')
    },
    query: {}
  }),

  // Delete Sample (Soft Delete)
  delete: celebrate({
    params: {
      sampleId: Joi.objectId().required().description('Sample ID')
    },
    query: {}
  })
}
