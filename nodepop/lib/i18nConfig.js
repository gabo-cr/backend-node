const i18n = require('i18n');
const path = require('node:path');

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  autoReload: true,
  syncFiles: true,
  cookie: 'nodepop-locale'
});

module.exports = i18n;
