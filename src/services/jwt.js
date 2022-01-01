
// ---------------------------------------------------------
// ------------------ JWT Token Functions ------------------
// ---------------------------------------------------------

const { promisify } = require('util')
const Jwt    = require('jsonwebtoken')
const Boom   = require('@hapi/boom')
const config = require('../configs')
const redis  = require('./redis')

// Creates JWT Token
function create(data, expire = config.jwt.expiration) {
  const secretKey = config.jwt.key
  const options = {
    expiresIn: expire,
    algorithm: config.jwt.algorithm
  }
  const token = Jwt.sign(data, secretKey, options)
  const key = `${config.jwt.cache_prefix}${token}`
  redis.set(key, 'valid')
  return token
}

// Creates Non Expire JWT Token (Caching is temporarily disabled)
function createNonExpire(data) {
  const token = Jwt.sign(data, config.jwt.key, {
    algorithm: config.jwt.algorithm
  })
  const key = `${config.jwt.cache_prefix}${token}`
  redis.set(key, 'valid')
  return token
}

// Decode Given Token from Request Headers ['authorization]
function decode(token) {
  return Jwt.decode(token)
}

// Blocks JWT Token from cache
function block(token) {
  if (!token) throw new Error('Token is undefined.')
  const decoded = Jwt.decode(token)
  const key = `${config.jwt.cache_prefix}${token}`
  if (decoded.exp) {
    const expiration = decoded.exp - Date.now()
    redis.multi().set(key, 'blocked').expire(key, expiration).exec()
  } else {
    redis.del(key)
  }
}

// Renew JWT Token when is going to be expired
function renew(token, expire) {
  if (!token) throw new Error('Token is undefined.')
  if (!config.jwt.allow_renew) throw new Error('Renewing tokens is not allowed.')

  const now = new Date().getTime()
  const decoded = Jwt.decode(token)
  if (!decoded.exp) return token
  if (decoded.exp - now > config.jwt.renew_threshold) return token

  this.block(token)
  if (decoded.iat) delete decoded.iat
  if (decoded.exp) delete decoded.exp
  return this.create(decoded, expire || config.jwt.expiration)
}

// Checks the validity of JWT Token
async function isValid(token) {
  try {
    const key = `${config.jwt.cache_prefix}${token}`
    const asyncRedisGet = promisify(redis.get).bind(redis)
    const value = await asyncRedisGet(key)
    const decoded = Jwt.decode(token)

    if (decoded.exp) { // expire token

      if (decoded.exp >= new Date().getTime()) { // token is not expired yet
        if (value === 'valid') return decoded    // token is not revoked
        else return false   // token is revoked
      } else return false   // token is expired

    } else return decoded   // a non-expire token [no exp in object]

  } catch (err) {
    console.log(' >>> JWT Token isValid error: ', err)
    throw Boom.unauthorized('Invalid Token')
  }
}

module.exports = { create, createNonExpire, decode, renew, isValid, block }
