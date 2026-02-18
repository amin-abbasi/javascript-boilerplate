require('dotenv').config()
const Joi = require('joi')

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  SERVER_PROTOCOL: Joi.string().default('http'),
  SERVER_HOST: Joi.string().default('localhost'),
  SERVER_PORT: Joi.number().default(3003),
  JWT_SECRET: Joi.string()
    .when('NODE_ENV', {
      is: 'test',
      then: Joi.string().default('test_jwt_secret'),
      otherwise: Joi.string().required()
    })
    .description('JWT Secret Key'),
  DB_TYPE: Joi.string()
    .valid('mongodb', 'mysql')
    .when('NODE_ENV', {
      is: 'test',
      then: Joi.string().default('mongodb'),
      otherwise: Joi.string().required()
    }),
  DB_HOST: Joi.string().when('NODE_ENV', {
    is: 'test',
    then: Joi.string().default('localhost'),
    otherwise: Joi.string().required()
  }),
  DB_PORT: Joi.number().when('NODE_ENV', {
    is: 'test',
    then: Joi.number().default(27017),
    otherwise: Joi.number().required()
  }),
  DB_NAME: Joi.string().when('NODE_ENV', {
    is: 'test',
    then: Joi.string().default('test_db'),
    otherwise: Joi.string().required()
  }),
  DB_USER: Joi.string().optional(),
  DB_PASS: Joi.string().optional(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379)
})
  .unknown()
  .required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const env = envVars

// All Configs that needed to be centralized
const config = {
  // JWT Configuration
  jwt: {
    key: env.JWT_SECRET,
    expiration: 20 * 60 * 1000,
    algorithm: 'HS384',
    cache_prefix: 'token:',
    allow_renew: true,
    renew_threshold: 2 * 60 * 1000
  },

  // dotenv App Environment Variables
  env: env,

  // Base URL
  baseURL: `${env.SERVER_PROTOCOL}://${env.SERVER_HOST}:${env.SERVER_PORT}`,

  // Regex
  regex: {
    objectId: /^[0-9a-fA-F]{24}$/
  }
}

module.exports = config
