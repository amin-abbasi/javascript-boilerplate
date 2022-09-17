// -------------------------------------- Initialize Redis --------------------------------------
const redis  = require('redis')
const config = require('../configs')

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = config.env

// 'redis[s]://[[username][:password]@][host][:port][/db-number]'
const url = `redis://${ REDIS_PASS ? `:${REDIS_PASS}@` : '' }${REDIS_HOST}:${REDIS_PORT}`

const options = { url }
if(REDIS_PASS) options.password = REDIS_PASS

const client = redis.createClient(options)
client.on('error', (err) => console.log('Redis Client Error: ', err))
console.log('<<<< Connected to Redis >>>>')

module.exports = client
