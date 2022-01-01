// ------ Add npm modules
const express = require('express')
const helmet  = require('helmet')
const cors    = require('cors')
const { urlencoded, json } = require('body-parser')

const app = express()

// ------ Initialize & Use Middle-Wares
// app.set('trust proxy', 1)
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(helmet())
app.use(cors())

// ------ Add config to access everywhere
const config = require('./configs')
app.set('config', config)

// TODO: Add other caching systems (like 'RabbitMQ') in the future

// ------ Socket.io Integration
// const http   = require('http')
// const socket = require('socket.io')
// const server = new http.Server(app)
// const io = socket(server)
// app.set('io', io)

// ------ Allows cross-origin domains to access this API
// const initCors = require('./middlewares/cors')
// app.use(initCors)

// ------ Add Redis to system globally [Caching System]
// const redis = require('./services/redis')
// app.set('redis', redis)

// ------ Add JWT to system globally
// const jwt = require('express-jwt')
// app.use(jwt({ secret: config.jwt.key }))

// ------ Require global methods
// const methods = require('./services/methods')
// app.set('methods', methods)

// ------ Add logger to system
const logger = require('./middlewares/logger')
app.use(logger)

// ------ Require all routes
const router = require('./routes')
app.use('/api', router)

// ------ Add Response Decorator (& error handler) to system
const decorator = require('./middlewares/decorator')
app.use(decorator)

module.exports = app
