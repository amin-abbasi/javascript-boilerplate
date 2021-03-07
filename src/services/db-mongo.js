const mongoose = require('mongoose')
const config   = require('../configs')

// Database URL
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = config.env
const dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

// Mongoose module options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false
}

// Secure MongoDB with username and password
if(DB_USER && DB_PASS) {
  options.user = DB_USER
  options.pass = DB_PASS
}

async function connectDB() {

  // Mongoose Debug Mode [set it as `false` in production]
  mongoose.set('debug', true)

  mongoose.connect(dbURL, options)
  mongoose.Promise = global.Promise // Get Mongoose to use the global promise library
  const db = mongoose.connection    // Get the default connection

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', (err) => console.error('MongoDB Connection Error: ', err))

  return db
}

module.exports = connectDB
