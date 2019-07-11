let test = require('tape')
let path = require('path')
let child = require('child_process')

test('cli module from the shell', t=> {
  t.plan(1)
  let index = path.join(__dirname, '..', 'index.js')
  child.exec(`node ${index}`, {shell:true}, function exec(err, stdout, stderr) {
    if (err) t.fail(err)
    else {
      t.ok(true, 'runs')
      console.log(err, stdout, stderr)
    }
  })
})
