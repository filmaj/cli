let waterfall = require('run-waterfall')
let parallel = require('run-parallel')
let aws = require('aws-sdk')
let chalk = require('chalk')
let utils = require('@architect/utils')
let dirtyDeployOne = require('./deploy-one')

/**
 * attempts to resolve logical ids for all rsources in the given stack
 * then attempts to updateFunctionCode for those resources
 *
 * @param {Array} opts - argument options passed in
 * @param {Function} callback - node style errback
 * @returns {Promise} if no callback is supplied
 */
module.exports = function dirty(opts, callback) {

  // time the deploy
  let ts = Date.now()
  let url

  // return a promise if a callback is not supplied
  let promise
  if (!callback) {
    promise = new Promise(function ugh(res, rej) {
      callback = function errback(err, result) {
        if (err) rej(err)
        else res(result)
      }
    })
  }

  let pretty = {
    url(v) {
      if (v)
        console.log(chalk.cyan.underline(v), '\n')
    },
    warn() {
      console.log('🤠', chalk.yellow.bold('Dirty deploy!'))
    },
    success() {
      let msg = chalk.grey('deployed in')
      let time = chalk.green.bold((Date.now() - ts)/1000 + ' seconds')
      console.log('✅', chalk.green.bold('Success'), msg, time)
    }
  }

  let {arc} = utils.readArc()
  let appname = arc.app[0]
  let name = `${utils.toLogicalID(appname)}Staging`

  pretty.warn()
  waterfall([

    function readResources(callback) {
      let cloudformation = new aws.CloudFormation
      cloudformation.listStackResources({
        StackName: name
      },
      function done(err, data) {
        if (err) callback(err)
        else {
          let find = i=> i.ResourceType === 'AWS::Lambda::Function'
          let functions = data.StackResourceSummaries.filter(find)
          callback(null, functions)
        }
      })
    },

    function readLocal(functions, callback) {
      let {localPaths} = utils.inventory(arc)
      parallel(localPaths.map(pathToCode=> {
        return function one(callback) {
          let folder = pathToCode.split('/').reverse().shift()
          let logicalID = utils.toLogicalID(folder)
          let found = functions.find(f=> f.LogicalResourceId === logicalID)
          if (found) {
            let FunctionName = found.PhysicalResourceId
            dirtyDeployOne({
              FunctionName,
              pathToCode,
              arc,
            }, callback)
          }
          else {
            console.warn(`${pathToCode} logical id not found`)
            callback()
          }
        }
      }),
      function done(err) {
        if (err) callback(err)
        else {
          pretty.success()
          callback()
        }
      })
    },

    function readURL(callback) {
      let cloudformation = new aws.CloudFormation
      cloudformation.describeStacks({
        StackName: name
      },
      function done(err, data) {
        if (err) console.log(err)
        else if (Array.isArray(data.Stacks)) {
          let outs = data.Stacks[0].Outputs
          let maybe = outs.find(o=> o.OutputKey === 'ProductionURL')
          if (maybe)
            url = maybe.OutputValue
        }
        callback()
      })
    },
    function _pretty(callback) {
      pretty.url(url)
      callback()
    }

  ], callback)

  return promise
}
