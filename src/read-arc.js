let chalk = require('chalk')
let parse = require('@architect/parser')
let fs = require('fs')
let {join} = require('path')

let read = p=> fs.readFileSync(p).toString()
let exists = fs.existsSync
let cache = false

function err(msg) {
  console.log(chalk.bgBlack.red.bold('Error'), chalk.bgBlack.white.bold(msg))
}

/**
 * lookup .arc with fallbacks for:
 *
 * - app.arc
 * - arc.yaml
 * - arc.json
 */
module.exports = function readArc(params={}) {
  if (cache) return cache
  else {
    let cwd = params.cwd? params.cwd : process.cwd()

    let arcDefaultPath = join(cwd, '.arc')
    let appDotArcPath = join(cwd, 'app.arc')
    let arcYamlPath = join(cwd, 'arc.yaml')
    let arcJsonPath = join(cwd, 'arc.json')

    let raw
    let arc
    try {
      if (exists(arcDefaultPath)) {
        raw = read(arcDefaultPath)
        arc = parse(raw)
      }
      else if (exists(appDotArcPath)) {
        raw = read(appDotArcPath)
        arc = parse(raw)
      }
      else if (exists(arcYamlPath)) {
        raw = read(arcYamlPath)
        arc = parse.yaml(raw)
        // HACK
        raw = parse.yaml.stringify(raw)
      }
      else if (exists(arcJsonPath)) {
        raw = read(arcJsonPath)
        arc = parse.json(raw)
        // HACK
        raw = parse.json.stringify(raw)
      }
      else {
        throw Error('not_found')
      }
    }
    catch(e) {
      if (e.message === 'not_found') {
        console.log(chalk.grey('.------------------------------.'))
        console.log(chalk.grey('|'), chalk.bold.yellow('Warning'), chalk.yellow('.arc file not found!'), chalk.grey('|'))
        console.log(chalk.grey('|'), chalk.grey('Generate by running'), chalk.bold.green('arc init'), chalk.grey('|'))
        console.log(chalk.grey('\'------------------------------\''))
      }
      else {
        err('invalid arcfile in ' + cwd)
        process.exit(1)
      }
    }
    cache = {raw, arc}
    return cache
  }
}
