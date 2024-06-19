// Open http://<app_host>:<app_port>/docs in your browser to view the documentation.
const swagger = require('swagger-jsdoc')
const config = require('../configs')
const package = require('../../package.json')

const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = config.env
const url = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/api`

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: package.name,
    version: package.version,
    description: package.description,
    license: { name: package.license, url: 'http://aminaeon.ir/licenses' },
    contact: { name: package.author, email: 'amin4193@gmail.com' }
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

const options = {
  swaggerDefinition,
  // Path files to be processes. for: {openapi: '3.0.0'}
  apis: ['../routes/*.js', '../models/*.js']
  // files: ['../routes/*.js', '../models/*.js'],  // Path files to be processes. for: {swagger: '2.0'}
  // basedir: __dirname, //app absolute path
  // onValidateError: (errors, req, res, next) => { // global handler for validation errors
  //   res.status(400).send(errors)
  // },
}

const specs = swagger(options)
module.exports = specs
