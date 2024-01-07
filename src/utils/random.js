const numbers = '0123456789',
  alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  specials = '!$%^&*()_+|~-=`{}[]:;<>?,./'

const DEFAULT_LENGTH = 8
const DEFAULT_CHARSET = 'all'

function useDefault(options) {
  const defaultOptions = {
    length: options?.length || DEFAULT_LENGTH,
    charset: options?.charset || DEFAULT_CHARSET,
    exclude: Array.isArray(options?.exclude) ? options.exclude : []
  }
  return defaultOptions
}

function buildChars(options) {
  let chars = ''
  switch (options.charset) {
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
  if (options.exclude) {
    for (let i = 0; i < options.exclude.length; i++) {
      chars = chars.replace(options.exclude[i], '')
    }
  }
  return chars
}

function random(options) {
  options = useDefault(options)
  const length = options.length
  let random = ''
  const allChars = buildChars(options)
  const charsLength = allChars.length
  for (let i = 1; i <= length; i++) {
    const index = Math.floor(Math.random() * charsLength)
    random += allChars.substring(index, index + 1)
  }
  return random
}

module.exports = { random }
