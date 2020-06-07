// initialize our logger (in our case, winston)

const winston = require('winston')
const expressWinston = require('express-winston')

module.exports = (app) => {

  const logFormat = winston.format.printf((info) => {
    return `[${info.timestamp}] ${JSON.stringify(info.meta)} ${info.level}: ${info.message}`
  })

  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')

  app.use(
    expressWinston.logger({
      transports: [ new winston.transports.Console(), new winston.transports.File({ filename: `${__dirname}/logs/app.log` }) ],
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
  )
  return app
}
