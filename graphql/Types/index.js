const mergegraphql = require("merge-graphql-schemas")
const logType=  require("./Log")

const types = [
  logType
];

module.exports = mergegraphql.mergeTypes(types)
