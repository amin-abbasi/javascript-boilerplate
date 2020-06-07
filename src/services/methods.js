const https  = require('https')
const http   = require('http')
// const Jwt    = require('jsonwebtoken')
// const moment = require('moment')

module.exports = (app) => {

  /**
   * Find Property
   * @param   {[Object]}  properties  array of properties object
   * @param   {String}    label       label to be find in properties
   * @return  {Object}                returns object of property and return `-1` if not found any
   */
  function findProp(properties, label) {
    for (let index = 0; index < properties.length; index++) {
      if(properties[index].label == label) return properties[index]
    }
    return -1
  }

  /**
   * Check if an object is JSON
   * @param   {Object}   object  an object to be checked
   * @return  {Boolean}  return `true` if object is JSON, and return `false` if it isn't
   */
  function isJSON(object) {
    if (typeof object != 'string') object = JSON.stringify(object)
    try {
      JSON.parse(object)
      return true
    }
    catch (e) { return false }
  }

  // JWT Token Functions
  const jwt = {
    // Creates JWT Token
    create (data, expire = app.config.jwt.expiration) {
      return Jwt.sign(data, app.config.jwt.key, { expiresIn: expire, algorithm: app.config.jwt.algorithm })
    },

    // Creates Non Expire JWT Token (Caching is temporarily disabled)
    createNonExpire (data) {
      // let redis = app.plugins['hapi-redis'].client
      let token = Jwt.sign(data, app.config.jwt.key, { algorithm: app.config.jwt.algorithm })
      // let key = `${app.config.jwt.cache_prefix}${token}`
      // redis.set(key, 'valid')
      return token
    },

    // Blocks JWT Token from cache
    block (token) {
      // let decoded = Jwt.decode(token, app.config.jwt.key)
      // let redis = app.plugins['hapi-redis'].client
      // let key = `${app.config.jwt.cache_prefix}${token}`
      // if(!(decoded.exp == null || decoded.exp == undefined )) {
      //   let expiration = decoded.exp - moment().unix()
      //   redis.multi().set(key, "blocked").expire(key, expiration).exec()
      // }
      // else {
      //   redis.del(key)
      // }
    },

    // Renew JWT Token when is going to be expired
    renew (token, routePlugins, expire) {
      if(!token) throw new Error('Token is undefined')
      if((!app.config.jwt.allow_renew && routePlugins.jwtRenew == undefined) || (routePlugins.jwtRenew == false))
        throw new Error('Renewing tokens is not allowed')
      let decoded = Jwt.decode(token, app.config.jwt.key)
      if(decoded.exp == null || decoded.exp == undefined) return token

      // TODO: Check moment().unix() vs. Date.now()
      // if( (decoded.exp - moment().unix()) > app.config.jwt.renew_threshold ) return token
      if( (decoded.exp - Date.now()) > app.config.jwt.renew_threshold ) return token

      // this.block(token, decoded)
      delete decoded.iat
      delete decoded.exp
      return this.create(decoded, expire || app.config.jwt.expiration)
    },

    // Checks the validity of JWT Token
    isValid (token) {
      // return new Promise((resolve, reject) => {
      //   let redis = app.plugins['hapi-redis'].client
      //   let key = `${app.config.jwt.cache_prefix}${token}`
      //   redis.get(key, (err, value) => {
      //     if(err) return reject(Error('Can not validate because cache app is not responsive'))
      //     let decoded = Jwt.decode(token, app.config.jwt.key)
      //     if(!(decoded.exp == null || decoded.exp == undefined)) {
      //       if(value === null) return resolve(true)
      //       resolve(false)
      //     }
      //     else {
      //       if(value === null) return resolve(false)
      //       resolve(true)
      //     }
      //   })
      // })
    }
  }

  /**
   * Request Function
   * @param   {Object}   opt       an object for request options
   * @param   {String}   protocol  request protocol `http` or `https`
   * @param   {String}   format    request format response `json` or others
   * @param   {Object}   bodyData  an object for request post or put body data
   * @return  {Object}   returns request response
   */
  function request(opt, protocol, format, bodyData) {

    if(bodyData && opt.headers)
      if(!opt.headers['Content-Length']) {
        bodyData = JSON.stringify(bodyData)
        opt.headers['Content-Length'] = Buffer.byteLength(bodyData)
      }

    const Protocol = (protocol === 'https') ? https : http
    return new Promise((resolve, reject) => {
      const request = Protocol.request(opt, (response) => {
        response.setEncoding('utf8')
        let body = ''
        response.on('data', (chunk) => { body += chunk })
        response.on('end', () => {
          const result = isJSON(body) ? JSON.parse(body) : body
          resolve(result)
        })
      })
      request.on('error', (e) => { console.log(`CONNECTION ERROR FOR: ${JSON.stringify(opt)}\nERROR: `, e);  reject(e) })
      if(bodyData) request.write(bodyData)
      request.end()
    })
  }

  return { request, jwt, findProp, isJSON }
}
