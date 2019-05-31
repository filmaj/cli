let readArcFile = require('@architect/utils/read-arc')
let chalk = require('chalk')
let {version} = require('../../package.json')

module.exports = function printBanner() {

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

  console.log(chalk.grey(`     app ${x} ${chalk.cyan.bold(name)}`))
  console.log(chalk.grey(`  region ${x} ${chalk.cyan(region)}`))
  console.log(chalk.grey(` profile ${x} ${chalk.cyan(profile)}`))
  console.log(chalk.grey(` version ${x} ${chalk.cyan(version)}`))
  console.log(chalk.grey(`     cwd ${x} ${chalk.cyan(process.cwd())}\n`))
}
