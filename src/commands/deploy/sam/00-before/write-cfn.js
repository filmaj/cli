let aws = require('aws-sdk')
let series = require('run-series')
let parallel = require('run-parallel')
let path = require('path')
let fs = require('fs')

let samPackage = require('./package')

module.exports = function writeCFN({nested, appname, bucket, pretty}, callback) {
  if (nested) {
    series([
      function base(callback) {
        samPackage({
          filename: `${appname}-cfn.json`,
          bucket,
          pretty,
        }, callback)
      },
      function http(callback) {
        samPackage({
          filename: `${appname}-cfn-http.json`,
          bucket,
          pretty,
        }, callback)
      },
      function events(callback) {
        samPackage({
          filename: `${appname}-cfn-events.json`,
          bucket,
          pretty,
        }, callback)
      },
      function uploadToS3(callback) {
        let s3 = new aws.S3
        parallel({
          http(callback) {
            let Key = `${appname}-cfn-http.yaml`
            let Body = fs.readFileSync(path.join(process.cwd(), Key))
            s3.putObject({
              Bucket: bucket,
              Key,
              Body,
            }, callback)
          },
          events(callback) {
            let Key = `${appname}-cfn-events.yaml`
            let Body = fs.readFileSync(path.join(process.cwd(), Key))
            s3.putObject({
              Bucket: bucket,
              Key,
              Body,
            }, callback)
          },
        }, callback)
      },
    ], callback)
  }
  else {
    samPackage({
      filename: `sam.json`,
      bucket,
      pretty,
    }, callback)
  }
}
