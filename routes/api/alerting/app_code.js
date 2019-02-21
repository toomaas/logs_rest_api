const oracledb = require('oracledb') // node official oracle driver

  module.exports.get = async function (req, res) {
    let conn = await elasticsearch_connection()
    res.send('showing app codes')
  }