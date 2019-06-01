let aws = require('aws-sdk')
let utils = require('@architect/utils')
let waterfall = require('run-waterfall')

module.exports = function patchApiGateway(opts, callback) {

  let production = opts.some(opt=> '-p --production production prod'.split(' ').includes(opt))
  let {arc} = utils.readArc()
  let appname = arc.app[0]
  let name = `${utils.toLogicalID(appname)}${production? 'Production' : 'Staging'}`

  waterfall([
    function(callback) {
      let cloudformation = new aws.CloudFormation
      cloudformation.listStackResources({
        StackName: name
      },
      function done(err, data) {
        if (err) callback(err)
        else {
          let find = i=> i.ResourceType === 'AWS::ApiGateway::RestApi'
          let restApiId = data.StackResourceSummaries.find(find).PhysicalResourceId
          callback(null, restApiId)
        }
      })
    },
    function(restApiId, callback) {
      // update binary media types to */*
      let apigateway = new aws.APIGateway
      apigateway.updateRestApi({
        restApiId,
        patchOperations: [{
          op: 'add',
          path: '/binaryMediaTypes/*~1*'
        }]
      },
      function done(err) {
        if (err) callback(err)
        else callback(null, restApiId)
      })
    },
    function(restApiId, callback) {
      let apigateway = new aws.APIGateway
      apigateway.createDeployment({
        restApiId,
        stageName: 'production'
      },
      function done(err) {
        if (err) callback(err)
        else callback()
      })
    }
  ], callback)
}

