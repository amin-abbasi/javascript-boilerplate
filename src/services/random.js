const numbers = '0123456789',
  alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  specials = '!$%^&*()_+|~-=`{}[]:;<>?,./'

function useDefault(options) {
  options || (options = {})
  return {
    length: options.length || 8,
    charset: options.charset || 'all',
    exclude: Array.isArray(options.exclude) ? options.exclude : [],
  }
}

function buildChars(options) {
  let chars = ''
  switch (options?.charset) {
    case 'numeric':
      chars = numbers
      break
    case 'alphabetic':
      chars = alphabets
      break
    case 'alphanumeric':
      chars = numbers + alphabets
      break
    default:
      chars = numbers + alphabets + specials
      break
  }
  if(options?.exclude)
    for (let i = 0; i <= options.exclude.length; i++) {
      chars = chars.replace(options.exclude[i], '')
    }
  return chars
}

module.exports = function random(options) {
  options = useDefault(options)
  const length = options.length
  let index, random = ''
  const allChars = buildChars(options), charsLength = allChars.length
  for (let i = 1; i <= length; i++) {
    index = Math.floor(Math.random() * charsLength)
    random += allChars.substring(index, index + 1)
  }
  return random
}
