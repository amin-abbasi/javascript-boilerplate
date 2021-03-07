// initialize our logger (our use-case: Winston)
const expressWinston = require('express-winston')
const winston = require('winston')
const config  = require('../configs')

const logFormat = winston.format.printf((info) => {
  let format = `[${info.timestamp}] ${JSON.stringify(info.meta)} ${info.level}: ${info.message}`
  if(config.env.NODE_ENV !== 'development') format = `[${info.timestamp}] ${info.level}: ${info.message}`
  return format
})

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')

const logger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${__dirname}/logs/app.log` })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.json(),
    logFormat
  ),
  meta: true,
  expressFormat: true,
  colorize: true,
})

module.exports = logger
