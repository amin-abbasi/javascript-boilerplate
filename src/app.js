const express = require('express')
const helmet  = require('helmet')

// ------ Initialize
const app = express()

// ------ Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())

// ------ Socket.io Integration
// const http   = require('http')
// const socket = require('socket.io')
// const server = new http.Server(app)
// const io = socket(server)
// app.set('io', io)

// ------ Allows cross-origin domains to access this API
// const initCors = require('./middlewares/cors')
// app.use(initCors)

// ------ Add i18n to system
const i18n = require('./middlewares/i18n')
app.use(i18n)

// ------ Add logger to system
const logger = require('./middlewares/logger')
app.use(logger)

// ------ Require all routes
const router = require('./routes')
app.use('/api', router)

// ------ Add Response Transformer
const transformer = require('./middlewares/transformer')
app.use(transformer)

module.exports = app
