let series = require('run-series')
let installDeps = require('./install-deps')
let copyArc = require('./copy-arc')
let copyShared = require('./copy-shared')
let copyViews = require('./copy-views')
let copyStaticJSON = require('./copy-static-json')

module.exports = function hydrate(/*opts*/) {
  series([
    installDeps,
    copyShared,
    copyViews,
    copyStaticJSON,
    copyArc,
  ])
}
