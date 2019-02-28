const mergegraphql = require("merge-graphql-schemas")
const LogResolver = require("./Log")

const resolvers = [
  LogResolver
];


module.exports = mergegraphql.mergeResolvers(resolvers)
