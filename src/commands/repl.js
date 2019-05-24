#!/usr/bin/env node
var init = require('@architect/architect/src/util/init')
var cleanEnv = require('@architect/architect/src/util/clean-env')
var populateEnv = require('@architect/architect/src/util/populate-env')
var sandbox = require('@architect/architect/src/sandbox')

var chalk = require('chalk')
var repl = require('repl')
var series = require('run-series')

module.exports = function arcRepl(/*opts*/) {
  series([
    cleanEnv,     // If no NODE_ENV specified, set it to 'testing'
    init,         // Initialize app metadata, creds, etc.
    populateEnv,  // Populate env vars from .arc-env (jic)
  ],
  function done(err) {
    if (err) throw err
    var prompt = chalk.green('#!/data> ')
    // Must require data when called or it'll miss init and env population
    if (process.env.NODE_ENV === 'testing') {
      var db = sandbox.db.start(function _start() {
        var server = repl.start({prompt})
        // eslint-disable-next-line
        server.context.data = require('@architect/data')
        server.on('exit', db.close)
      })
    }
    else {
      var server = repl.start({prompt})
      // eslint-disable-next-line
      server.context.data = require('@architect/data')
    }
  })
}
