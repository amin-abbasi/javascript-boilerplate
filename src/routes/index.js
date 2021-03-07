const { errors } = require('celebrate')
const { Router } = require('express')

const router = Router()

// ------ Add JWT to chosen routes
// const jwt    = require('express-jwt')
// const config = require('../configs')
// const JwtCheck = jwt({ secret: config.jwt.key })
// router.use('/v1/samples', JwtCheck, sampleRouter)

// Sample APIs
const sampleRouter = require('./sample')
router.use('/v1/samples', sampleRouter)

// API Documentation Swagger
const swaggerUi = require('swagger-ui-express')
const specs = require('../services/swagger')
router.use('/docs', swaggerUi.serve)
router.get('/docs', swaggerUi.setup(specs, { explorer: true }))

// Health-check Endpoint
router.get('/health', (_req, res) => { res.send('200') })

router.use(errors())

module.exports = router