const mongoose = require('mongoose')
const config   = require('../configs')

// Database URL
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = config.env
const dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

// Mongoose module options
const options = { autoIndex: false }

// Secure MongoDB with username and password
if(DB_USER && DB_PASS) {
  options.user = DB_USER
  options.pass = DB_PASS
}

mongoose.set('strictQuery', false)

async function connectDB() {
  try {
    // Mongoose Debug Mode [set it as `false` in production]
    mongoose.set('debug', true)

    await mongoose.connect(dbURL, options)
    console.log('<<<< Connected to MongoDB >>>>')

    mongoose.Promise = global.Promise // Get Mongoose to use the global promise library
    const db = mongoose.connection    // Get the default connection

    // Bind connection to error event (to get notification of connection errors)
    db.on('error', (err) => console.error('MongoDB Connection Error: ', err))

    return db
  } catch (error) {
    console.error('MongoDB Connection Error: ', error)
    process.exit(1)
  }
}

module.exports = connectDB
