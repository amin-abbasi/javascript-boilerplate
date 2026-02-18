// Open http://<app_host>:<app_port>/docs in your browser to view the documentation.
const swagger = require('swagger-jsdoc')
const config = require('../configs')
const pkg = require('../../package.json')

const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = config.env
const url = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/api`

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: pkg.name,
    version: pkg.version,
    description: pkg.description,
    license: { name: pkg.license, url: 'http://aminaeon.ir/licenses' },
    contact: { name: pkg.author, email: 'amin4193@gmail.com' }
  },
  servers: [{ url: `${url}/v1` }],
  // basePath: '/v1',
  // schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json']
  // host: url, // Host (optional)
  // securityDefinitions: {
  //   JWT: {
  //       type: 'apiKey',
  //       in: 'header',
  //       name: 'Authorization',
  //       description: "JWT Token for user's authorization",
  //   }
  // }
}

const path = require('path')

const options = {
  swaggerDefinition,
  // Path files to be processes. for: {openapi: '3.0.0'}
  apis: [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../models/*.js')]
}

const specs = swagger(options)
module.exports = specs
