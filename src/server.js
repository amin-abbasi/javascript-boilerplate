// Your Express Server Configuration Here
require('reflect-metadata')
const fs     = require('fs')
const path   = require('path')
const http   = require('http')
const https  = require('https')
const gach   = require('gach').default

const app    = require('./app')
const config = require('./configs')

const { NODE_ENV, SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT, DB_TYPE } = config.env

// ------ Require Database (mongodb OR mysql)
const mongoConnect = require('./services/db-mongo')
const mysqlConnect = require('./services/db-mysql')

// TODO: Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function setExpressServer(app) {
  let expressServer
  if (SERVER_PROTOCOL === 'http') expressServer = http.createServer(app)
  else {
    const keyPath = path.join(__dirname, '../sslCert/server.key')
    const crtPath = path.join(__dirname, '../sslCert/server.crt')
    const checkPath = fs.existsSync(keyPath) && fs.existsSync(crtPath)
    if (!checkPath) {
      console.error('No SSL Certificate found to run HTTPS Server!!')
      process.exit(1)
    }
    const privateKey = fs.readFileSync(keyPath, 'utf8')
    const certificate = fs.readFileSync(crtPath, 'utf8')
    const credentials = {
      key: privateKey,
      cert: certificate
    }
    expressServer = https.createServer(credentials, app)
  }
  return expressServer
}


// ---------------- Add Socket.io ----------------
// const socket = require('socket.io')
// const io: socket.Server = socket(expressServer)
// app.set('io', io)

// ---------------- Start Server ----------------
const startServer = async (expressServer) => {
  const port = SERVER_PORT || 4000
  const url = `${SERVER_PROTOCOL || 'http'}://${SERVER_HOST || 'localhost'}:${port}`
  const serverMessage = `API is now running on ${gach(url).color('lightBlue').bold().text} in ${NODE_ENV || 'development'} mode`
  expressServer.listen(port, () => { console.info(serverMessage) })
}

(async () => {
  try {
    if(DB_TYPE === 'mongodb') await mongoConnect()
    else await mysqlConnect()

    const expressServer = setExpressServer(app)
    await startServer(expressServer)
  } catch (error) {
    throw Error(`>>>>> Server Connection Error: ${error}`)
  }
})()
