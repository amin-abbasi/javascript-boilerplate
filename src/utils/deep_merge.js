/**
 * Checks if the given item is an object.
 * @param item The item to check
 * @returns True if the item is an object, false otherwise
 */
function isObject(item) {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Recursively merges two or more objects deeply.
 * Arrays are concatenated, and objects are merged together.
 * @param target The target object to merge into
 * @param sources Objects to merge into the target
 * @returns A new object resulting from the deep merge
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target

  const merged = isObject(target) ? { ...target } : target

  for (const source of sources) {
    if (isObject(source)) {
      for (const key in source) {
        if (isObject(source[key]) && isObject(merged[key])) {
          merged[key] = mergeDeep(merged[key], source[key])
        } else if (Array.isArray(source[key]) && Array.isArray(merged[key])) {
          merged[key] = merged[key].concat(source[key]) // Merge arrays
        } else {
          merged[key] = source[key] // Replace or set values
        }
      }
    }
  }

  return merged
}

module.exports = { isObject, mergeDeep }
