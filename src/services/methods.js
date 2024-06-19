const axios = require('axios')
const Error = require('../services/http_errors')
const MESSAGES = require('../middlewares/i18n/types')
const jwt = require('./jwt')

/**
 * Generate an access token
 * @param    {string}     userId        User Id
 * @param    {string}     role          User Role
 * @param    {string}     email         User Email
 * @param    {string}     mobile        User Mobile
 * @param    {boolean}    rememberMe    if `true` it will generate non-expire token
 * @return   {string}     returns authorization token for header
 */
function setToken(userId, role, rememberMe, email, mobile) {
  const jwtObject = {
    id: userId,
    email,
    mobile,
    role,
    iat: new Date().getTime()
  }
  const accessToken = rememberMe
    ? jwt.createNonExpire(jwtObject)
    : jwt.create(jwtObject)
  return `Bearer ${accessToken}`
}

function setError(statusCode, message, errors) {
  return { statusCode, message, errors }
}

/**
 * Simple Rest API function to do something from a 3rd party
 * @param    {string}    method     API Method [Required] - `POST` | `GET` | `PUT` | `DELETE`
 * @param    {string}    baseUrl    API Base URL [Required]
 * @param    {string}    pathUrl    API Path URL [Optional]
 * @param    {object}    headers    API Headers [Optional] - { [key: string]: string }
 * @param    {object}    body       API Body [Optional] - { [key: string]: any }
 * @param    {object}    query      API Query [Optional] - { [key: string]: string }
 * @return   {Promise<object>}      returns response
 */
async function restAPI(data) {
  try {
    const { method, baseUrl, pathUrl, headers, body, query } = data
    let URL = `${baseUrl}${pathUrl || ''}`
    const opt = {
      method,
      headers: { 'content-type': 'application/json' }
    }

    if (method.toUpperCase() !== 'GET' && body) opt.body = JSON.stringify(body)
    if (headers) opt.headers = { ...opt.headers, ...headers }
    if (query) URL += '?' + new URLSearchParams(query).toString()

    const response = await axios(URL, opt)
    const text = await response.text()
    const result = tryJSON(text)
    if (!result)
      return {
        success: false,
        error: setError(555, 'Invalid data to parse to JSON.', text)
      }
    if (!response.ok)
      return {
        success: false,
        error: setError(
          response.status,
          result.message || `${data.service} failed.`,
          result
        )
      }
    return { success: true, result }
  } catch (error) {
    console.log(' ---- Rest API Error: ', error)
    throw Error.ServiceUnavailable(MESSAGES.SERVICE_UNAVAILABLE, {
      service: data.service
    })
  }
}

module.exports = { setToken, restAPI }
