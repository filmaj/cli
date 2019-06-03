let maybeCreate = require('./00-maybe-create')
let ensureCreds = require('./01-ensure-creds')
let printBanner = require('./02-print-banner')

module.exports = function before(args) {
  maybeCreate() // maybe create .arc
  ensureCreds() // loads AWS_REGION and AWS_PROFILE
  printBanner(args) // prints cli banner
}
