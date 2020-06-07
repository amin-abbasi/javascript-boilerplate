// Import npm modules
const cors    = require('cors')
const express = require('express')
const helmet  = require('helmet')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

// initialize & use middle-wares
app.set('trust proxy', 1)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(helmet())
app.use(cors())

// TODO: Add other caching systems (like 'RabbitMQ') in the future

// TODO: Add Swagger for API documentation

// Add Redis to system [Caching System]
// app.redis = require('./services/redis')(app)

// Socket.io Integration
// Set Socket Io
// const http   = require('http')
// const server = http.Server(app)
// const io     = require('socket.io')(server)
// app.use((req, res, next) => {
//   console.log(' ------- Socket.io is on!')
//   req.io = io
//   next()
// })

// Allows cross-origin domains to access this API
// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin' , '')
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
//   res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
//   res.append('Access-Control-Allow-Credentials', true)
//   next()
// })

// Add config to access everywhere
app.config = require('./configs/config')

// Require global methods
app.methods = require('./services/methods')(app)

// Add logger to system
const logger = require('./services/logger')(app)

// Require Database (mongodb)
require('./services/db')()

// Require all routes
const router = require('./routes')(app)
app.use('/', router)

// Add Response Decorator (& error handler) to system
const decorator = require('./services/response_decorator')
app.use(decorator)

// Listen on the designated port found in the .env [use 'server' instead of 'app' if you have socket.io]
app.listen(process.env.SERVER_PORT || 4000, err => {
  if (err) { logger.error(err); process.exit(1) }

  // output the status of the app in the terminal
  const url = `${process.env.SERVER_PROTOCOL || 'http'}://${process.env.SERVER_HOST || 'localhost'}:${process.env.SERVER_PORT || 4000}`
  console.info(`API is now running on ${url} in ${process.env.NODE_ENV || 'development'} mode`)
})

module.exports = app
