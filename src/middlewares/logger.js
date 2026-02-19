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

async function saveLog(log, pathToSave, type) {
  const fileName = type === 'error' ? 'error.log' : 'info.log'
  const filePath = path.join(pathToSave, fileName)

  try {
    await fs.promises.access(pathToSave)
  } catch (error) {
    await fs.promises.mkdir(pathToSave, { recursive: true })
  }

  await fs.promises.appendFile(filePath, `\n${log}`, { encoding: 'utf-8' })
}

/**
 * Print logs for API endpoints using the following pattern:
 * `[timestamp] method: url response.statusCode processingTime`
 * @param mode mode to show extra information in log `short` or `full`
 */
function init(options) {
  return function (req, res, next) {
    try {
      const { saveToFile, pathToSave } = options
      const { method, url, ip } = req,
        start = process.hrtime()

      res.once('finish', () => {
        const end = process.hrtime(start)
        const duration = processTimeInMS(end)
        const status = statusColor(res.statusCode, false)

        const logEntry = {
          timestamp: new Date().toISOString(),
          level: status.type,
          method,
          url,
          status: res.statusCode,
          duration,
          ip,
          requestId: req.headers['x-request-id'] || 'N/A'
        }

        if (options.mode === 'full') {
          logEntry.request = {
            headers: req.headers,
            params: req.params,
            query: req.query,
            body: req.body
          }
        }

        const logString = JSON.stringify(logEntry)
        console.log(logString)

        if (saveToFile) saveLog(logString, pathToSave, status.type)
      })

      next()
    } catch (error) {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Log Error',
          error: error.message
        })
      )
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
