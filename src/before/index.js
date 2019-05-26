let maybeCreate = require('./00-maybe-create')
let populateEnv = require('./01-populate-env')
let ensureCreds = require('./02-ensure-creds')
let printBanner = require('./03-print-banner')

module.exports = function before() {
  maybeCreate() // maybe create .arc
  populateEnv() // loads .arc-env into process.env
  ensureCreds() // loads AWS_REGION and AWS_PROFILE
  printBanner() // prints cli banner
}
