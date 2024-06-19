const path = require('path')
const gach = require('gach').default
const fs = require('fs')

function processTimeInMS(time) {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}

function color(text, color) {
  return gach(text).color(color).text
}

const STATUS_DATA = {
  '2xx': { type: 'info', color: 'lightGreen' },
  '3xx': { type: 'error', color: 'lightRed' },
  '4xx': { type: 'error', color: 'lightYellow' },
  '5xx': { type: 'error', color: 'red' },
  other: { type: 'error', color: 'lightMagenta' }
}

function statusColor(status, colored) {
  const text = status.toString()
  let result = { ...STATUS_DATA['other'], text }
  if (status >= 200 && status < 300) result = { ...STATUS_DATA['2xx'], text }
  if (status >= 300 && status < 400) result = { ...STATUS_DATA['3xx'], text }
  if (status >= 400 && status < 500) result = { ...STATUS_DATA['4xx'], text }
  if (status >= 500) result = { ...STATUS_DATA['5xx'], text }
  if (!colored) return result
  result.text = color(result.text, result.color)
  return result
}

function requestLog(req) {
  const { headers, body, params, query } = req
  return ` ${JSON.stringify({ headers, params, query, body })} `
}

function saveLog(log, pathToSave, type) {
  const exists = fs.existsSync(pathToSave)
  if (!exists) fs.mkdirSync(pathToSave)
  const fileName = type === 'error' ? 'error.log' : 'info.log'
  fs.appendFileSync(path.join(pathToSave, fileName), `\n${log}`, {
    encoding: 'utf-8'
  })
}

/**
 * Print logs for API endpoints using the following pattern:
 * `[timestamp] method: url response.statusCode processingTime`
 * @param mode mode to show extra information in log `short` or `full`
 */
function init(options) {
  return function (req, res, next) {
    try {
      const { mode, saveToFile, pathToSave, colored } = options
      const { method, url } = req,
        start = process.hrtime()

      const timestamp = new Date()
        .toISOString()
        .replace('T', ' - ')
        .replace('Z', '')
      const timeStampText = colored
        ? color(`[${timestamp}]`, 'lightBlue')
        : `[${timestamp}]`

      res.once('finish', () => {
        const end = process.hrtime(start)
        const endText = colored
          ? color(`${processTimeInMS(end)}`, 'green')
          : `${processTimeInMS(end)}`
        const status = statusColor(res.statusCode, colored)
        const request = mode === 'full' ? requestLog(req) : ' '
        const reqMethod = colored ? color(method, 'yellow') : method
        const log = `${timeStampText} ${reqMethod}: ${url}${request}${status.text} ${endText}`
        console.log(log)
        if (saveToFile) saveLog(log, pathToSave, status.type)
      })

      next()
    } catch (error) {
      console.log(color('>>>>> Log Error: ', 'lightRed'), error)
      next(error)
    }
  }
}

// Logger Options [To be filled by developer]
const loggerOptions = {
  colored: true,
  mode: 'short',
  saveToFile: true,
  pathToSave: path.join(__dirname, '../../logs')
}

module.exports = init(loggerOptions)
