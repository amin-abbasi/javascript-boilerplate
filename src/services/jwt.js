const Jwt    = require('jsonwebtoken')
const Error  = require('http-errors')
const config = require('../configs')
const redis  = require('./redis')
const MESSAGES = require('../middlewares/i18n/types')

const KEY_TYPES = {
  VALID: 'valid',
  BLOCKED: 'blocked'
}

// Creates JWT Token
function create(data, expire = config.jwt.expiration) {
  const secretKey = config.jwt.key
  const options = {
    expiresIn: expire,
    algorithm: config.jwt.algorithm
  }
  const token = Jwt.sign(data, secretKey, options)
  const key = `${config.jwt.cache_prefix}${token}`
  redis.set(key, KEY_TYPES.VALID)
  return token
}

// Creates Non Expire JWT Token (Caching is temporarily disabled)
function createNonExpire(data) {
  const token = Jwt.sign(data, config.jwt.key, {
    algorithm: config.jwt.algorithm
  })
  const key = `${config.jwt.cache_prefix}${token}`
  redis.set(key, KEY_TYPES.VALID)
  return token
}

// Decode Given Token from Request Headers ['authorization]
function decode(token) {
  return Jwt.decode(token)
}

// Blocks JWT Token from cache
function block(token) {
  if (!token) throw Error.UnprocessableEntity('Token is undefined.')
  const decoded = Jwt.decode(token)
  const key = `${config.jwt.cache_prefix}${token}`
  if (decoded.exp) {
    const expiration = decoded.exp - Math.floor(Date.now() / 1000)
    redis.multi().set(key, KEY_TYPES.BLOCKED).expire(key, expiration).exec()
  } else {
    redis.del(key)
  }
}

// Renew JWT Token when is going to be expired
function renew(token, expire) {
  if (!token) throw Error.UnprocessableEntity('Token is undefined.')
  if (!config.jwt.allow_renew) throw Error.MethodNotAllowed('Renewing tokens is not allowed.')

  const decoded = Jwt.decode(token)
  if (!decoded.exp) return token
  if (decoded.exp - Math.floor(Date.now() / 1000) > config.jwt.renew_threshold) return token

  block(token)
  if (decoded.iat) delete decoded.iat
  if (decoded.exp) delete decoded.exp
  return create(decoded, expire || config.jwt.expiration)
}

// Checks the validity of JWT Token
async function isValid(token) {
  try {
    const key = `${config.jwt.cache_prefix}${token}`
    const value = await redis.get(key)
    if(!value) return false    // token does not exist in Redis DB
    const decoded = Jwt.decode(token)

    const now = Math.floor(Date.now() / 1000)
    if(!decoded.exp) return decoded                       // token is non-expired type
    if(decoded.exp < now) return false                    // token is expired
    if(value && value !== KEY_TYPES.VALID) return false   // token is revoked

    return decoded
  } catch (err) {
    console.log(' >>> JWT Token isValid error: ', err)
    throw Error.Unauthorized(MESSAGES.UNAUTHORIZED)
  }
}

module.exports = { create, createNonExpire, decode, renew, isValid, block }
