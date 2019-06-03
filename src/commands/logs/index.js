let fs = require('fs')
let utils = require('@architect/utils')
let path = require('path')
let pretty = require('./pretty-print')
let nukeLogs = require('./nuke-logs')
let readLogs = require('./read-logs')

/**
 * arc logs src/http/get-index ................... gets staging logs
 * arc logs production src/http/get-index ........ gets production logs
 * arc logs nuke src/http/get-index .............. clear staging logs
 * arc logs nuke production src/http/get-index ... clear staging logs
 *
 * @param {Array} opts - option arguments
 * @param {Function} callback - a node-style errback
 * @returns {Promise} - if no callback is supplied
 */
module.exports = function samDeploy(opts, callback) {

  let promise
  if (!callback) {
    promise = new Promise(function ugh(res, rej) {
      callback = function errback(err, result) {
        if (err) rej(err)
        else res(result)
      }
    })
  }

  // flags
  let ts = Date.now()
  let known = 'logs -v --verbose verbose -n --nuke nuke -p --production production prod'.split(' ')
  let pathToCode = opts.find(opt=> !known.includes(opt))
  let verbose = opts.some(opt=> '-v --verbose verbose'.split(' ').includes(opt))
  let nuke = opts.some(opt=> '-n --nuke nuke'.split(' ').includes(opt))
  let production = opts.some(opt=> '-p --production production prod'.split(' ').includes(opt))
  let exists = (typeof pathToCode != 'undefined' && fs.existsSync(path.join(process.cwd(), pathToCode)))

  // config
  let {arc} = utils.readArc()
  let appname = arc.app[0]
  let name = `${utils.toLogicalID(appname)}${production? 'Production' : 'Staging'}`

  // flow
  if (!exists) {
    pretty.notFound(pathToCode)
  }
  else if (nuke) {
    nukeLogs({
      ts,
      name,
      pathToCode,
      verbose,
    }, callback)
  }
  else {
    readLogs({
      ts,
      name,
      pathToCode,
      verbose,
    }, callback)
  }

  return promise
}
