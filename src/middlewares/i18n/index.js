const en = require('./locales/en.json')
const fa = require('./locales/fa.json')

const SUPPORTED_LANGUAGES = ['en', 'fa', 'tr']

const translations = { en, fa }

function t(message, lang = 'en') {
  const translateTo = translations[lang]
  return translateTo[message] || message
}

// middleware to set language
module.exports = function i18n(req, res, next) {
  const headerLang = req.headers['content-language'] || req.headers['accept-language']

  // default language: 'en'
  let language = SUPPORTED_LANGUAGES[0]

  if(typeof headerLang === 'string' && SUPPORTED_LANGUAGES.includes(headerLang)) {
    language = headerLang
  }

  req.language = language
  res.t = t

  next()
}
