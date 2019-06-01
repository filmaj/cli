let aws = require('aws-sdk')
let chalk = require('chalk')
let series = require('run-series')
let package = require('@architect/package')
let utils = require('@architect/utils')
let child = require('child_process')
let path = require('path')
let fs = require('fs')
let statics = require('../static')
let patchApiGateway = require('./patch-apig')

/**
 * Shells out to AWS SAM for package/deploy
 *
 * @param {Array} opts - option arguments
 * @param {Function} callback - a node-style errback
 * @returns {Promise} - if not callback is supplied
 */
module.exports = function samDeploy(opts, callback) {

  let ts = Date.now()

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
  let verbose = opts.some(opt=> '-v --verbose verbose'.split(' ').includes(opt))
  let production = opts.some(opt=> '-p --production production prod'.split(' ').includes(opt))

  let {arc} = utils.readArc()
  let bucket = arc.aws.find(o=> o[0] === 'bucket')[1]
  let appname = arc.app[0]
  let name = `${utils.toLogicalID(appname)}${production? 'Production' : 'Staging'}`

  // printers
  let b = chalk.green.bold
  let d = chalk.green.dim
  let g = chalk.green

  let pretty = {
    package() {
      console.log(b('sam package'))
      console.log(d('       --template-file'), g('sam.json'))
      console.log(d('--output-template-file'), g('out.yaml'))
      console.log(d('           --s3-bucket'), g(bucket))
    },
    deploy() {
      console.log(b('sam deploy'))
      console.log(d('       --template-file'), g('out.yaml'))
      console.log(d('          --stack-name'), g(name))
      console.log(d('           --s3-bucket'), g(bucket))
      console.log(d('        --capabilities'), g('CAPABILITY_IAM'), '\n')
    },
    stdout(data) {
      if (verbose)
        console.log(chalk.grey(data))
    },
    stderr(data) {
      console.log(chalk.yellow.dim(data))
    },
    url(v) {
      console.log(chalk.cyan.underline(v), '\n')
    },
    success() {
      let check = chalk.green('✓')
      let msg = chalk.grey('Deployed')
      let time = chalk.green.bold((Date.now() - ts)/1000 + ' seconds')
      console.log(check, msg, time)
    }
  }

  // spawn helper
  function spawn(command, args, callback) {
    let pkg = child.spawn(command, args, {shell: true})
    pkg.stdout.on('data', pretty.stdout)
    pkg.stderr.on('data', pretty.stderr)
    pkg.on('close', ()=> callback())
    pkg.on('error', callback)
  }

  series([
    function toSAM(callback) {
      let name = path.join(process.cwd(), 'sam.json')
      let body = package(arc)
      fs.writeFile(name, JSON.stringify(body, null, 2), callback)
    },
    function samPackage(callback) {
      pretty.package()
      spawn('sam', [
        'package',
        '--template-file',
        'sam.json',
        '--output-template-file',
        'out.yaml',
        '--s3-bucket',
        bucket
      ], callback)
    },

    function samDeploy(callback) {
      pretty.deploy()
      spawn('sam', [
        'deploy',
        '--template-file',
        'out.yaml',
        '--stack-name',
        name,
        '--s3-bucket',
        bucket,
        '--capabilities',
        'CAPABILITY_IAM'
      ], callback)
    },

    function printURL(callback) {
      pretty.success()
      let cloudformation = new aws.CloudFormation
      cloudformation.describeStacks({
        StackName: name
      },
      function done(err, data) {
        if (err) console.log(err)
        else if (Array.isArray(data.Stacks)) {
          let outs = data.Stacks[0].Outputs
          let url = outs.find(o=> o.OutputKey === 'ProductionURL')
          if (url) pretty.url(url.OutputValue)
        }
        callback()
      })
    },

    function staticDeploy(callback) {
      if (arc.static)
        statics(opts, callback)
      else callback()
    },

    // the things I do..
    function patchAPIGatewayBinaryTypes(callback) {
      patchApiGateway(opts, callback)
    }
  ], callback)

  return promise
}
