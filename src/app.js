// Import npm modules
const cors    = require('cors')
const express = require('express')
const helmet  = require('helmet')
const bodyParser = require('body-parser')

const app = express()

// initialize & use middle-wares
app.set('trust proxy', 1)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(helmet())
app.use(cors())

// Add config to access everywhere
app.config = require('./configs/config')

// TODO: Add other caching systems (like 'RabbitMQ') in the future

// Socket.io Integration
// Set Socket Io
// const server = http.Server(app)
// const io     = require('socket.io')(server)
// app.use((req, res, next) => {
//   console.log(' ------- Socket.io is on!')
//   req.io = io
//   next()
// })

// Allows cross-origin domains to access this API
// app.use('./services/cors.js')

// Add Redis to system [Caching System]
// app.redis = require('./services/redis')(app.config)

// Require global methods
app.methods = require('./services/methods')(app)

// Add logger to system
const logger = require('./services/logger')(app)

// Require Database (mongodb)
require('./services/db')(app.config)

// Require all routes
const router = require('./routes')
app.use('/api', router)

// Swagger for API documentation
const swaggerOptions = require('./services/swagger')
const expressSwagger = require('express-swagger-generator')(app)
expressSwagger(swaggerOptions)

// Add Response Decorator (& error handler) to system
const decorator = require('./services/response_decorator')
app.use(decorator)

module.exports = app
