const redis = require('redis')

// TODO: Needs to be checked again for future uses
// -------------------------------------- Initialize redis + config --------------------------------------
module.exports = (config) => {

  const REDIS_URL = config.env.REDIS_URL || 'http://localhost:6379'
  const client    = redis.createClient(REDIS_URL)
  const { promisify } = require('util')
  const getAsync      = promisify(client.get).bind(client)
  client.on('connect', () => { console.log(`<<<< Connected to Redis >>>>`) })
  client.on('error', err => { console.log(`Redis Error: ${err}`) })

  // Redis functions
  function create(id, value, type) {
    return Promise.resolve( client.set(`${type}:${id}`, JSON.stringify(value)) )
  }

  function fetch(keyPattern) {
    return getAsync(keyPattern)
      .then((result) => {
        console.log('>>>>>>>>getAsync result: ', result)
        if(!result) return false
        return JSON.parse(result)
      })
      .catch((err) => {
        console.log('Redis Error - Fetch Data: ', err)
        throw err
      })
  }

  return { create, fetch }
}