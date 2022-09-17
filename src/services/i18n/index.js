const path = require('path')
const I18n = require('i18n')

/**
 * create a new instance with it's configuration
 */
const i18n = new I18n.I18n()
i18n.configure({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  header: 'accept-language',
  directory: path.join(__dirname, '/locales'),
})

module.exports = i18n
