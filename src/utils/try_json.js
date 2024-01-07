/**
 * Check if a string can be parsed to JSON
 * @param object The object to be parsed to JSON
 * @returns Returns the parsed JSON object if successful, otherwise returns false
 */
function tryJSON(object) {
  if (typeof object !== 'string') return false // Check if it's a string

  try {
    const parsedJSON = JSON.parse(object)
    if (typeof parsedJSON !== 'object' || parsedJSON === null) {
      return false // Ensure parsed result is an object
    }
    return parsedJSON // Return parsed JSON object
  } catch (e) {
    return false // Return false on parsing error
  }
}

module.exports = { tryJSON }
