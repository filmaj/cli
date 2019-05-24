let chalk = require('chalk')
let d = chalk.grey
let g = chalk.green
let G = chalk.green.bold

let helps = {
  help: `${G('arc [command] <options>')}

${chalk.grey.bold('Usage')}
  ${g('arc', G('init'), '<name>')} ${d('..... initialize a project')}
  ${g('arc', G('sandbox'))} ${d('......... work locally')}
  ${g('arc', G('repl'))} ${d('............ repl into dynamodb')}
  ${g('arc', G('package'))} ${d('......... deploy with SAM')}
  ${g('arc', G('help'), '<command>')} ${d('.. get help')}
  ${g('arc', G('version'))} ${d('......... current version')}`,

  init: `${G('arc init')}
${d('generate local code based on .arc (inc  .arc if none exists)')}`,

  package: `${G('arc package')}
generate sam.json based on .arc`,

  repl: `${G('arc repl')}
start a repl based on .arc`,

  sandbox: `${G('arc sandbox')}
start a local web server on 3333`,

  version: `${G('arc version')}
get the current version`
}

module.exports = function help(opts) {
  if (opts.length === 0) {
    console.log(helps.help)
  }
  else if (helps[opts[0]]) {
    console.log(helps[opts[0]])
  }
  else {
    console.log(`sorry, no help found for: ${opts[0]}`)
  }
}
