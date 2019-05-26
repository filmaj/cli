let series = require('run-series')
let chalk = require('chalk')
let net = require('net')
let {db, env, events, http} = require('@architect/architect/src/sandbox')

function getPort(opts) {
  for (let i = 0; i < opts.length; i++) {
    let opt = opts[i]
    if (opt === 'port' || opt === '-p' || opt === '--port') {
      let next = opts[i + 1]
      if (Number.isInteger(Number(next)))
        return next
      else
        return 3333
    }
  }
}

module.exports = function start(opts) {

  if (!process.env.PORT)
    process.env.PORT = 3333

  let findPort = opt=> opt === 'port' || opt === '-p' || opt === '--port'
  if (opts.some(findPort))
    process.env.PORT = getPort(opts)


  series([
    // hulk smash
    function _banner(callback) {
      let tester = net.createServer()
        .once('error', callback)
        .once('listening', function() {
          tester.once('close', function(){ callback() }).close()
        }).listen(process.env.PORT)
    },
    function _env(callback) {
      // populates additional environment variables
      env(callback)
    },
    function _db(callback) {
      // start dynalite with tables enumerated in .arc
      db.start(function() {
        let start = chalk.grey(chalk.green.dim('✓'), '@tables created in local database')
        console.log(`${start}`)
        callback()
      })
    },
    function _events(callback) {
      // listens for arc.event.publish events on 3334 and runs them in a child process
      events.start(function() {
        let start = chalk.grey(chalk.green.dim('✓'), '@events and @queues ready on local event bus')
        console.log(`${start}`)
        callback()
      })
    },
    function _http() {
      // vanilla af http server that mounts routes defined by .arc
      http.start(function() {
        let start = chalk.grey('\n', 'Started HTTP "server" @ ')
        let end = chalk.cyan.underline(`http://localhost:${process.env.PORT}`)
        console.log(`${start} ${end}`)
      })
    }
  ])
}
