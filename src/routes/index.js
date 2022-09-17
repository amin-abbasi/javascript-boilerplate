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

module.exports = router


// ------ Set Default Components for OpenAPI documentation

/**
 * @openapi
 * tags:
 *   name: Samples
 *   description: Sample management
 * components:
 *   responses:
 *     Success:
 *       description: Successful action
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Success'
 *     BadRequest:
 *       description: Bad request schema
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFound:
 *       description: The specified resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     Unauthorized:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *         message:
 *           type: string
 *         body:
 *           type: object
 *       required:
 *         - statusCode
 *         - message
 *       example:
 *         statusCode: 400
 *         message: 'Some Error ...'
 *         body: null
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Response Status
 *         result:
 *           $ref: '#/components/schemas/Sample'
 */
