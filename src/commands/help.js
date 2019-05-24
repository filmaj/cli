let helps = {
  help: `arc [command] <options>

Usage:
  arc init <name>
  arc sandbox
  arc repl 
  arc package 
  arc help <command>
  arc version`,
  init: `arc init
generate local code based on .arc (and generate a default .arc if none exists)`,
  package: `arc package
generate sam.json based on .arc`,
  repl: `arc repl
start a repl based on .arc`,
  sandbox: `arc sandbox
start a local web server on 3333`,
  version: `arc version
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
  console.log(`
architect/cli

sorry I don't know anything about that 
    `)

  }
}
