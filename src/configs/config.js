require('dotenv').config()

// All Configs that needed to be centralized
const config = {

  // JWT Configuration
  jwt: {
    key: 'your_jwt_secret_key',
    expiration: 3600,           // seconds (e.g.: 60, "2 days", "10h", "7d")
    algorithm: 'HS384',         // (default: HS256)
    cache_prefix: 'token:',
    allow_renew: true,
    renew_threshold: 60
  },

  env: process.env

  // MS Configs
  // MS: {
  //   some_microservice: {
  //     host: 'localhost',
  //     port: 3000,
  //     paths: {
  //       create: '/v1/sample',
  //     }
  //   }
  // }

}

module.exports = config