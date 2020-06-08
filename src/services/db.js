const mongoose = require('mongoose')

module.exports = (config) => {
  // Database URL
  const dbURL = `mongodb://${config.env.DB_HOST}:${config.env.DB_PORT}/${config.env.DB_NAME}`

  // Import the mongoose module
  mongoose.connect(dbURL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
  mongoose.Promise = global.Promise // Get Mongoose to use the global promise library
  const db = mongoose.connection    // Get the default connection

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error: '))
  return db
}
