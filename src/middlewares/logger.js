// initialize our logger (our use-case: Winston)
const expressWinston = require('express-winston')
const winston = require('winston')
const config  = require('../configs')

const logFormat = winston.format.printf((info) => {
  if(config.env.NODE_ENV !== 'development') return `[${info.timestamp}] ${info.level}: ${info.message}`
  return `[${info.timestamp}] ${JSON.stringify(info.meta)} ${info.level}: ${info.message}`
})

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')

const logger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ level: 'info', filename: `./logs/app.log` }),
    new winston.transports.File({ level: 'error', filename: `./logs/errors.log` }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    logFormat
  ),
  meta: true,
  expressFormat: true,
  colorize: true,
})

module.exports = logger
