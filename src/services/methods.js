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
  const accessToken = rememberMe ? jwt.createNonExpire(jwtObject) : jwt.create(jwtObject)
  return `Bearer ${accessToken}`
}

function setError(statusCode, message, errors) {
  return { statusCode, message, errors }
}

/**
 * Simple Rest API function to do something from a 3rd party
 * @param    {object}    data       API Request Data
 * @param    {string}    data.method     API Method [Required] - `POST` | `GET` | `PUT` | `DELETE`
 * @param    {string}    data.baseUrl    API Base URL [Required]
 * @param    {string}    data.pathUrl    API Path URL [Optional]
 * @param    {object}    data.headers    API Headers [Optional] - { [key: string]: string }
 * @param    {object}    data.body       API Body [Optional] - { [key: string]: any }
 * @param    {object}    data.query      API Query [Optional] - { [key: string]: string }
 * @return   {Promise<object>}      returns response
 */
async function restAPI(data) {
  try {
    const { method, baseUrl, pathUrl, headers, body, query } = data
    const url = `${baseUrl}${pathUrl || ''}`

    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        'content-type': 'application/json',
        ...headers
      },
      params: query,
      data: body
    }

    const response = await axios(config)
    const result = response.data

    return { success: true, result }
  } catch (error) {
    console.log(' ---- Rest API Error: ', error)

    if (error.response) {
      return {
        success: false,
        error: setError(error.response.status, error.response.data?.message || `${data.service || 'API'} failed.`, error.response.data)
      }
    }

    throw Error.ServiceUnavailable(MESSAGES.SERVICE_UNAVAILABLE, {
      service: data.service
    })
  }
}

module.exports = { setToken, restAPI }
