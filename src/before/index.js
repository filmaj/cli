let maybeCreate = require('./00-maybe-create')
let ensureCreds = require('./01-ensure-creds')
let banner = require('@architect/utils/banner')
let ver = require('../../package.json').version
let version = `Architect CLI ${ver}`

module.exports = function before() {
  maybeCreate()     // maybe create .arc
  ensureCreds()     // loads AWS_REGION and AWS_PROFILE
  banner({version}) // prints cli banner
}
