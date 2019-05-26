let chalk = require('chalk')

let {version} = require('../../package.json')
let readArcFile = require('../read-arc')
let x = process.platform.startsWith('win')? '~' : '⌁'

module.exports = function printBanner() {

  let {arc} = readArcFile()
  let name = arc? arc.app[0] : '.arc is undefined'

  let region = process.env.AWS_REGION || 'AWS_REGION is undefined'
  let profile = process.env.AWS_PROFILE || 'AWS_PROFILE is undefined'

  console.log(chalk.grey(`     app ${x} ${chalk.cyan.bold(name)}`))
  console.log(chalk.grey(`  region ${x} ${chalk.cyan(region)}`))
  console.log(chalk.grey(` profile ${x} ${chalk.cyan(profile)}`))
  console.log(chalk.grey(` version ${x} ${chalk.cyan(version)}`))
  console.log(chalk.grey(`     cwd ${x} ${chalk.cyan(process.cwd())}\n`))
}
