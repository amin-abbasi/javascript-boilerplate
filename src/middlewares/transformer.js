const { STATUS_CODES } = require('http')
const config = require('../configs')
const MESSAGES = require('./i18n/types')

function decorator(err, req, res, next) {
  // mongoose-unique-validator error
  if (err._message?.includes('validation failed')) {
    err.statusCode = 400
    err.message = MESSAGES.DB_VALIDATION_FAILED
    err.data = JSON.parse(JSON.stringify(err.errors))
    console.log(' ------- ResDec - Mongoose-Unique-Validator ERROR:', err)
  }

  if (err.joi) {
    err.statusCode = 400
    err.message = err.joi.details
    console.log(' ------- ResDec - JOI ERROR:', err)
  }

  const response = res.result
    ? {
        status: '',
        statusCode: res.statusCode,
        success: typeof res.result != 'string',
        result: res.result,
      }
    : {
        statusCode: err.statusCode || err.status || err.code || 500,
        message: err.message || STATUS_CODES[500],
        originalMessage: '',
        body: err.data || err.errors || null
      }

  if (typeof response.statusCode != 'number') {
    response.status = response.statusCode
    response.statusCode = 500
    console.log(' ------- ResDec - STRING STATUS CODE:', err)
  } else delete response.status

  if (response.statusCode >= 500)
    console.log(' ------- ResDec - SERVER ERROR:', err)

  // Set Error Message
  if (response.statusCode >= 300) {
    const messages = Object.keys(MESSAGES).filter((item) => isNaN(Number(item)))
    if (response.message) {
      if (!messages.includes(response.message)) {
        response.originalMessage = response.message
        response.message = MESSAGES.UNHANDLED_SERVER_ERROR
      }
      response.message = res.t(response.message, res.language)
    }
  }

  res.status(response.statusCode).json(response)
  next()
}

module.exports = decorator
