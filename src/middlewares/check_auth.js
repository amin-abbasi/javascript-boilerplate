const Boom    = require('@hapi/boom')
const { jwt } = require('../services/methods')
const config  = require('../configs')

// Function to set needed header auth
async function checkToken(req, _res, next) {
  try {
    const authToken = req.headers.authorization.split(' ')[1]
    if (!authToken || authToken === '') throw Boom.unauthorized('Invalid Token.')
    const user = await jwt.isValid(authToken)
    if (!user) throw Boom.unauthorized('Invalid Token.')
    req.user = user
    next()
  }
  catch (error) {
    console.log('Check Token Error: ', error)
    next(error)
  }
}


// Function to set needed header auth
function checkRole(roles) {
  return function(req, _res, next) {
    try {
      const validRoles = roles ? roles : [config.roleTypes.normal]
      const user = req.user
      if (!user || !validRoles.includes(user.role)) throw Boom.unauthorized('User is not authorized.')
      next()
    }
    catch (error) {
      console.log('Check Role Error: ', error)
      next(error)
    }
  }
}

module.exports = { checkToken, checkRole }
