const Joi = require('joi')
const config = require('../configs')
const validator = require('../middlewares/validator')

const objectId = Joi.string().regex(config.regex.objectId)

const exportResult = {

  // Create new Sample
  create: validator({
    body: Joi.object({
      name: Joi.string().required().description('User Name'),
      // userId: objectId.required().description('User ID')
    }),
    query: Joi.object({})
  }),

  // List All Samples
  list: validator({
    query: Joi.object({
      size: Joi.number().default(10).description('Sample Pagination Size'),
      page: Joi.number().default(1).description('Sample Pagination Page'),
      // name: Joi.string().max(50).description('Sample Name'),
      // userId: Joi.string().max(50).description('User ID'),
      // dateRange: Joi.object({
      //   from: Joi.date().description('Date Range From'),
      //   to:   Joi.date().description('Date Range To'),
      // }).or('from', 'to').description('Date Range'),
    })
  }),

  // Show Sample Details
  details: validator({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Update Sample
  update: validator({
    // body: Joi.object({
    //   name: Joi.string().description('User Name'),
    //   userId: objectId.required().description('User ID')
    // }),
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Delete Sample (Soft Delete)
  delete: validator({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

  // Secure Action
  secureAction: validator({
    params: Joi.object({
      sampleId: objectId.required().description('Sample ID')
    }),
    query: Joi.object({})
  }),

}

module.exports = exportResult
