let readArcFile = require('@architect/utils/read-arc')
let chalk = require('chalk')
let {version} = require('../../package.json')

module.exports = function printBanner(args) {

  let arc
  try {
    let parsed = readArcFile()
    arc = parsed.arc
  }
  catch(e) {
    if (e.message != 'not_found')
      console.log(e)
  }

  let name = arc? arc.app[0] : '.arc is undefined'
  let x = process.platform.startsWith('win')? '~' : '⌁'

  let region = process.env.AWS_REGION || 'AWS_REGION is undefined'
  let profile = process.env.AWS_PROFILE || 'AWS_PROFILE is undefined'
  let lead = args[0] === 'env'? '#' : ' '

  console.log(chalk.grey(`${lead}     app ${x} ${chalk.cyan.bold(name)}`))
  console.log(chalk.grey(`${lead}  region ${x} ${chalk.cyan(region)}`))
  console.log(chalk.grey(`${lead} profile ${x} ${chalk.cyan(profile)}`))
  console.log(chalk.grey(`${lead} version ${x} ${chalk.cyan(version)}`))
  console.log(chalk.grey(`${lead}     cwd ${x} ${chalk.cyan(process.cwd())}\n`))
}
