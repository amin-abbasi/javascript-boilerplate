const Error = require('http-errors')
const MESSAGES = require('./i18n/types')

function createMessage(error, reqKey) {
  const errors = {}
  for (let i = 0; i < error.details.length; i++) {
    const message = error.details[i].message
    const key = message.split('\"')[1]
    errors[key] = [ message + ` (${reqKey})` ]
  }
  return errors
}

function validate(dataValidate) {
  return async function (req, _res, next) {
    try {
      let errors = {}

      const keys = Object.keys(dataValidate)
      for(let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const data = dataValidate[key]
        const filledData = req[key]
        const result = data.validate(filledData, { abortEarly: false })
        if(result?.error) errors = { ...errors, ...createMessage(result.error, key) }
        else req[key] = result?.value
      }

      if(Object.keys(errors).length !== 0) throw Error(400, MESSAGES.VALIDATION_ERROR, { errors })
      next()
    } catch (error) { next(error) }
  }
}

module.exports = validate
