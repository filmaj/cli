let aws = require('aws-sdk')
let chalk = require('chalk')
let readArcFile = require('../read-arc')
let warn = msg=> console.log(chalk.yellow(msg))

/**
 * ensures the following env vars are present:
 *
 * - NODE_ENV (default 'testing')
 * - AWS_REGION (default us-west-2)
 * - AWS_PROFILE (will warn if not present)
 */
module.exports = function ensureCreds() {

  let {arc} = readArcFile()

  // always ensure NODE_ENV
  if (!process.env.hasOwnProperty('NODE_ENV'))
    process.env.NODE_ENV = 'testing'

  // always ensure AWS_REGION
  if (!process.env.AWS_REGION)
    process.env.AWS_REGION = 'us-west-2'

  if (arc && arc.aws) {
    let region = arc.aws.find(e=> e[0] === 'region')
    let profile = arc.aws.find(e=> e[0] === 'profile')

    if (region)
      process.env.AWS_REGION = region[1]

    if (profile) {
      process.env.AWS_PROFILE = profile[1]
    }
    else {
      warn('missing AWS_PROFILE')
    }

    // FORCE use AWS_REGION and AWS_PROFILE
    if (process.env.AWS_PROFILE) {
      aws.config.credentials = new aws.SharedIniFileCredentials({
        profile: process.env.AWS_PROFILE
      })
    }
  }
}
