let fs = require('fs')
let chalk = require('chalk')
let path = require('path')
let parse = require('@architect/parser')

/**
 * populate process.env with .arc-env
 * if NODE_ENV=staging the process.env is populated by @staging (etc)
 * if ARC_LOCAL is present process.env is populated by @testing (so you can access remote dynamo locally)
 */
module.exports = function populateEnv() {
  let envPath = path.join(process.cwd(), '.arc-env')
  if (fs.existsSync(envPath)) {
    let raw = fs.readFileSync(envPath).toString()
    try {
      let env = parse(raw)
      let actual = process.env.hasOwnProperty('ARC_LOCAL')
        ? 'testing'
        : process.env.NODE_ENV
      env[actual].forEach(tuple=> {
        process.env[tuple[0]] = tuple[1]
      })
      let local = 'init process.env from .arc-env @testing (ARC_LOCAL override)'
      let not = 'init process.env from .arc-env @' + process.env.NODE_ENV
      let msg = process.env.hasOwnProperty('ARC_LOCAL')? local : not
      console.log(chalk.grey(chalk.green.dim('✓'), msg))
    }
    catch(e) {
      console.log(chalk.bold.red(`Parse Error`), chalk.bold.white('invalid '+envPath))
      console.log(chalk.dim(e.stack))
    }
  }
}
