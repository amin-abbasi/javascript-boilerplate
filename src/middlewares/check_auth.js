const Error = require('../services/http_errors')
const Jwt = require('../services/jwt')
const config = require('../configs')
const MESSAGES = require('./i18n/types')

// Function to set needed header auth
async function checkToken(req, _res, next) {
  try {
    const authToken = req.headers.authorization.split(' ')[1]
    if (!authToken || authToken === '')
      throw Error.Unauthorized(MESSAGES.UNAUTHORIZED)
    const user = await Jwt.isValid(authToken)
    if (!user) throw Error.Unauthorized(MESSAGES.UNAUTHORIZED)
    req.user = user
    next()
  } catch (error) {
    console.log('Check Token Error: ', error)
    next(error)
  }
}

// Function to set needed header auth
function checkRole(roles) {
  return function (req, _res, next) {
    try {
      const validRoles = roles ? roles : [config.roleTypes.normal]
      const user = req.user
      if (!user || !validRoles.includes(user.role))
        throw Error.Unauthorized(MESSAGES.UNAUTHORIZED)
      next()
    } catch (error) {
      console.log('Check Role Error: ', error)
      next(error)
    }
  }
}

module.exports = { checkToken, checkRole }
