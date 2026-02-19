const mongoose = require('mongoose')
const config = require('../configs')

// Database URL
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = config.env
const dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

// Mongoose module options
const options = { autoIndex: false }

// Secure MongoDB with username and password
if (DB_USER && DB_PASS) {
  options.user = DB_USER
  options.pass = DB_PASS
}

mongoose.set('strictQuery', false)

async function connectDB() {
  const maxRetries = 5
  let retries = 0

  while (retries < maxRetries) {
    try {
      // Mongoose Debug Mode [set it as `false` in production]
      mongoose.set('debug', config.env.NODE_ENV === 'development')

      await mongoose.connect(dbURL, options)
      console.log('<<<< Connected to MongoDB >>>>')

      mongoose.Promise = global.Promise
      const db = mongoose.connection

      db.on('error', (err) => console.error('MongoDB Connection Error: ', err))
      return db
    } catch (error) {
      retries++
      console.error(`MongoDB Connection Error (Attempt ${retries}/${maxRetries}): `, error.message)
      if (retries >= maxRetries) {
        process.exit(1)
      }
      // Wait 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
}

module.exports = connectDB
