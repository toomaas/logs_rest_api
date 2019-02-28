const elasticsearch = require('elasticsearch')

// creates a client instance
const getConnection = async () => {
  new elasticsearch.Client({
    host: process.env.ELASTICSEARCH_HOST
    // log: 'trace'
  })}

module.exports = getConnection