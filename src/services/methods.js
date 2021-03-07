const { promisify } = require('util')
const fetch  = require('node-fetch')
const Jwt    = require('jsonwebtoken')
const Boom   = require('@hapi/boom')
const config = require('../configs')
const redis  = require('./redis')

/**
 * Check if an object is JSON
 * @param   object  an object to be parsed to JSON
 * @return  return valid object if it is JSON, and return `null` if it isn't
 */
function tryJSON(object) {
  try { return JSON.parse(object) }
  catch (e) { return null }
}

// JWT Token Functions
const jwt = {
  // Creates JWT Token
  create(data, expire = config.jwt.expiration) {
    const secretKey = config.jwt.key
    const options = {
      expiresIn: expire,
      algorithm: config.jwt.algorithm
    }
    const token = Jwt.sign(data, secretKey, options)
    const key = `${config.jwt.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  },

  // Creates Non Expire JWT Token (Caching is temporarily disabled)
  createNonExpire(data) {
    const token = Jwt.sign(data, config.jwt.key, {
      algorithm: config.jwt.algorithm
    })
    const key = `${config.jwt.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  },

  // Decode Given Token from Request Headers ['authorization]
  decode(token) {
    return Jwt.decode(token)
  },

  // Blocks JWT Token from cache
  block(token) {
    if (!token) throw new Error('Token is undefined.')
    const decoded = Jwt.decode(token)
    const key = `${config.jwt.cache_prefix}${token}`
    if (decoded.exp) {
      const expiration = decoded.exp - Date.now()
      redis.multi().set(key, 'blocked').expire(key, expiration).exec()
    } else {
      redis.del(key)
    }
  },

  // Renew JWT Token when is going to be expired
  renew(token, expire) {
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
  },

  // Checks the validity of JWT Token
  async isValid(token) {
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
}

/**
 * Set Unique Array Function
 * @param array array of string to be checked
 */
function setUniqueArray(array) {
  return array.filter((value, index, self) => self.indexOf(value) === index)
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return mergeDeep(target, ...sources)
}

/**
 * Generate an access token
 * @param    {string}     userId        User Id
 * @param    {string}     role          User Role
 * @param    {string}     email         User Email
 * @param    {string}     mobile        User Mobile
 * @param    {boolean}    rememberMe    if `true` it will generate non-expire token
 * @return   {string}     returns authorization token for header
 */
function setToken(userId, role, rememberMe, email, mobile) {
  const jwtObject = {
    id: userId,
    email: email,
    mobile: mobile,
    role: role,
    iat: new Date().getTime()
  }
  const accessToken = rememberMe ? jwt.createNonExpire(jwtObject) : jwt.create(jwtObject)
  return `Bearer ${accessToken}`
}

/**
 * MS-Sample function to do something
 * @param    {string}    sampleId    Sample ID
 * @return   {Promise<IResponse>}    returns response
 */
async function doSomething(sampleId) {
  try {
    const { url, paths } = config.MS.some_microservice
    const URL = `${url}${paths.doSomething}`
    const opt = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sampleId })
    }
    const result = await fetch(URL, opt)
    const response = await result.json()
    console.log(' ---- MS-Sample Result: ', response)
    if(!result.ok) throw response
    return { success: true, result: response }
  } catch (err) {
    console.log(' ---- MS-Sample Error: ', err)
    return { success: false, error: err }
  }
}

module.exports = { tryJSON, jwt, setUniqueArray, mergeDeep, setToken, doSomething }
