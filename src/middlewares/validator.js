const Boom = require('@hapi/boom')

function createMessage(error) {
  const splitMessage = error.message.split('\"')
  const key = splitMessage[1]
  return { [key]: [error.message] }
}

function validate(dataValidate) {
  return async function (req, _res, next) {
    try {
      let errors = {}

      const keys = Object.keys(dataValidate)
      keys.forEach(key => {
        const data = dataValidate[key]
        const filledData = req[key]
        const result = data.validate(filledData)
        if(result?.error) errors = { ...errors, ...createMessage(result.error) }
        else req[key] = result?.value
      })

      if(Object.keys(errors).length !== 0) throw Boom.badRequest('Validation Error', errors)
      next()
    } catch (error) { next(error) }
  }
}

module.exports = validate
