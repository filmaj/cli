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
 * -d|--dirty|dirty ............. *staging only* dirty deploy function code/config
 * -s|--static|static ........... dirty deploys /public to s3 bucket
 * -v|--verbose|verbose ......... prints all output to console
 */
let isDirty = opt=> opt === 'dirty' || opt === '--dirty' || opt === '-d'
let isStatic = opt=> opt === 'static' || opt === '--static' || opt === '-s'

module.exports = async function deploy(opts=[]) {

  validate(opts)

  if (opts.some(isDirty))
    return dirty(opts)

  if (opts.some(isStatic))
    return statics(opts)

  return sam(opts)
}
