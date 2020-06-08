// Open http://<app_host>:<app_port>/api-docs in your browser to view the documentation.

const options = {
  swaggerDefinition: {
    // openapi: '3.0.0',
    info: {
      title: 'MS-Sample API',
      version: '1.0.0',
      swagger: '2.0',
      description: 'A micro-service to work on actions.',
      license: {
        name: 'AAH',
        url: 'http://aminaeon.ir/licenses'
      },
      contact: {
        name: 'Amin Abbasi',
        // url: 'http://aminaeon.ir',
        email: 'amin4193@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1'
      }
    ],
    basePath: '/v1',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    // host: `localhost:${PORT}`, // Host (optional)
    securityDefinitions: {
      JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: "JWT Token for user's authorization",
      }
    },
  },

  // List of files to be processes. You can also set globs './routes/*.js'
  files: ['../routes/*.js', '../models/*.js'],  //Path to the API handle folder

  basedir: __dirname, //app absolute path
  // basePath: '/', // Base path (optional)
  // onValidateError: (errors, req, res, next) => { // global handler for validation errors
  //   res.status(400).send(errors)
  // },
}

module.exports = options