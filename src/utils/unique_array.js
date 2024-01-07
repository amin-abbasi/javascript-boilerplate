function setUniqueArray(array, prop) {
  if (typeof prop === 'string') {
    const uniqueMap = new Map()

    for (const item of array) {
      if (!uniqueMap.has(item[prop])) {
        uniqueMap.set(item[prop], item)
      }
    }

    return Array.from(uniqueMap.values())
  } else {
    return [...new Set(array)]
  }
}

module.exports = { setUniqueArray }
