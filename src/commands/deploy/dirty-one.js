var series = require('run-waterfall')
var path = require('path')
var zipit = require('zipit')
var glob = require('glob')
var zipdir = require('zip-dir')
let waterfall = require('run-waterfall')
let aws = require('aws-sdk')

/**
 * zips and uploads the function to aws
 */
module.exports = function uploadZip({FunctionName, pathToCode}, callback) {
  waterfall([
    function(callback) {
      zip(pathToCode, callback)
    },
    function(buffer, callback) {
      let lambda = new aws.Lambda
      lambda.updateFunctionCode({
        FunctionName,
        ZipFile: buffer
      },
      function(err) {
        if (err) callback(err)
        else {
          //let lambdaBytes = Buffer.byteLength(buffer, 'utf8')
          //let oneMegInBytes = 1000000
          //let lambdaMegs = (lambdaBytes/oneMegInBytes).toFixed(2)
          //let stats = {name: pathToCode, size: `${lambdaMegs} mb`}
          callback()
        }
      })
    }
  ], callback)
}

// zip impl
function zip(pathIn, callback) {
  let zipt = process.platform.startsWith('win')? winzip : nixzip
  zipt(pathIn, callback)
}

function winzip(pathToCode, callback) {
  zipdir(pathToCode, callback)
}

function nixzip(pathToCode, callback) {
  series([
    // get a handle on the files to zip
    function _read(callback) {
      glob(path.join(process.cwd(), pathToCode, '/*'), {dot:true}, callback)
    },
    function _zip(files, callback) {
      zipit({
        input: files,
      }, callback)
    },
  ], callback)
}
