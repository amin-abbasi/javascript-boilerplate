const app = require('./app')
const env = app.config.env

// Listen on the designated port found in the .env [use 'server' instead of 'app' if you have socket.io]
app.listen(env.SERVER_PORT || 4000, err => {
  if (err) {
    console.info('SERVER ERROR: ', colors.red(err));
    throw new Error(`SERVER ERROR: ${colors.red(err)}`)
  }

  // output the status of the app in the terminal
  const url = `${env.SERVER_PROTOCOL || 'http'}://${env.SERVER_HOST || 'localhost'}:${env.SERVER_PORT || 4000}`
  console.info(`API is now running on ${url} in ${env.NODE_ENV || 'development'} mode`)
})

module.exports = app
