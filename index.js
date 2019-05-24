#!/usr/bin/env node
let help = require('./src/commands/help')
let init = require('./src/commands/init')
let package = require('./src/commands/package')
let repl = require('./src/commands/repl')
let sandbox = require('./src/commands/sandbox')
let version = require('./src/commands/version')

// todo: hydrate (js, py and rb)
// todo: env upgrade (cf uses local .arc-env for deploy)
// todo: port deploy to overwrite cloudformation resources
let cmds = {
  help, 
  init, 
  package, 
  repl, 
  sandbox, 
  version
}

let args = process.argv.slice(0)
let binary = args.shift()
let path = args.shift()

if (args.length === 0) {
  help(args)
}
else {
  let cmd = args.shift()
  let opts = args.slice(0)
  if (cmds[cmd]) {
    try {
      cmds[cmd](opts)
    }
    catch(e) {
      console.log('Command failed' + cmd)
      console.log(e)
      process.exit(1)
    }
  }
  else {
    console.log('Unknown command: ' + cmd)
    process.exit(1)
  }
}
