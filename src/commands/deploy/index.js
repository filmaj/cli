let dirty = require('./dirty')
let statics = require('./static')
let sam = require('./sam')
let validate = require('./validate')

/**
 * `arc deploy`
 *
 * deploys the current .arc as a sam application to AppNameStaging stack
 *
 * options
 * -p|--production|production ... deploys to AppNameProduction
 * -d|--dirty|dirty ............. stging only dirty deploy deploy
 * -s|--static|static ........... deploys /public to static bucket
 * -v|--verbose|verbose ......... prints all output to console
 */
let isDirty = opt=> opt === 'dirty' || opt === '--dirty' || opt === '-d'
let isStatic = opt=> opt === 'static' || opt === '--static' || opt === '-s'

module.exports = function deploy(opts=[]) {

  validate(opts)

  if (opts.some(isDirty)) {
    dirty(opts)
  }
  else if (opts.some(isStatic)) {
    statics(opts)
  }
  else {
    sam(opts)
  }
}
