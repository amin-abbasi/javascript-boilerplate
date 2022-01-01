const fetch  = require('node-fetch')
const config = require('../configs')

/**
 * Check if an object is JSON
 * @param   object  an object to be parsed to JSON
 * @return  return valid object if it is JSON, and return `null` if it isn't
 */
function tryJSON(object) {
  try { return JSON.parse(object) }
  catch (e) { return null }
}

/**
 * Set Unique Array Function
 * @param array array of string to be checked
 */
function setUniqueArray(array) {
  return array.filter((value, index, self) => self.indexOf(value) === index)
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return mergeDeep(target, ...sources)
}

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
    email: email,
    mobile: mobile,
    role: role,
    iat: new Date().getTime()
  }
  const accessToken = rememberMe ? jwt.createNonExpire(jwtObject) : jwt.create(jwtObject)
  return `Bearer ${accessToken}`
}

/**
 * MS-Sample function to do something
 * @param    {string}    sampleId    Sample ID
 * @return   {Promise<IResponse>}    returns response
 */
async function doSomething(sampleId) {
  try {
    const { url, paths } = config.MS.some_microservice
    const URL = `${url}${paths.doSomething}`
    const opt = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sampleId })
    }
    const result = await fetch(URL, opt)
    const response = await result.json()
    console.log(' ---- MS-Sample Result: ', response)
    if(!result.ok) throw response
    return { success: true, result: response }
  } catch (err) {
    console.log(' ---- MS-Sample Error: ', err)
    return { success: false, error: err }
  }
}

module.exports = { tryJSON, setUniqueArray, mergeDeep, setToken, doSomething }
