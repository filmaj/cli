// strip from architect/architect
// attempts to resolve logical ids for all rsources in the given stack
// then attempts to updateFunctionCode for those resources
module.exports = function dirty(opts, callback) {
  let promise
  if (!callback) {
    promise = new Promise(function ugh(res, rej) {
      callback = function errback(err, result) {
        if (err) rej(err)
        else res(result)
      }
    })
  }

  console.log('TODO dirty static deploy here')

  return promise
}
