/*eslint no-unused-vars: "off" */
let chalk = require('chalk')
let waterfall = require('run-waterfall')
let cleanEnv = require('@architect/architect/src/util/clean-env')
let start = require('@architect/architect/src/sandbox/start')
let canUse = require('@architect/architect/src/sandbox/_port-in-use')

/*hack for dynalite paths to help pkg find them*/
let batchGetItem = require('dynalite/actions/batchGetItem.js')
let batchWriteItem = require('dynalite/actions/batchWriteItem.js')
let createTable = require('dynalite/actions/createTable.js')
let deleteItem = require('dynalite/actions/deleteItem.js')
let deleteTable = require('dynalite/actions/deleteTable.js')
let describeTable = require('dynalite/actions/describeTable.js')
let getItem = require('dynalite/actions/getItem.js')
let listTables = require('dynalite/actions/listTables.js')
let putItem = require('dynalite/actions/putItem.js')
let query = require('dynalite/actions/query.js')
let scan = require('dynalite/actions/scan.js')
let tagResource = require('dynalite/actions/tagResource.js')
let untagResource = require('dynalite/actions/untagResource.js')
let updateItem = require('dynalite/actions/updateItem.js')
let updateTable = require('dynalite/actions/updateTable.js')
let batchGetItemv = require('dynalite/validations/batchGetItem.js')
let batchWriteItemv = require('dynalite/validations/batchWriteItem.js')
let createTablev = require('dynalite/validations/createTable.js')
let deleteItemv = require('dynalite/validations/deleteItem.js')
let deleteTablev = require('dynalite/validations/deleteTable.js')
let describeTablev = require('dynalite/validations/describeTable.js')
let getItemv = require('dynalite/validations/getItem.js')
let listTablesv = require('dynalite/validations/listTables.js')
let putItemv = require('dynalite/validations/putItem.js')
let queryv = require('dynalite/validations/query.js')
let scanv = require('dynalite/validations/scan.js')
let tagResourcev = require('dynalite/validations/tagResource.js')
let untagResourcev = require('dynalite/validations/untagResource.js')
let updateItemv = require('dynalite/validations/updateItem.js')
let updateTablev = require('dynalite/validations/updateTable.js')
/*end hack*/

let PORT = process.env.PORT || 3333

module.exports = function sandbox(opts) {
  waterfall([
    canUse(PORT),
    cleanEnv,
    start
  ],
  function done(err) {
    if (err) throw err
  })
}
