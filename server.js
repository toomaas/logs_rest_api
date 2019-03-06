const express = require('express')
const app = express() // define app using express
const bodyParser = require('body-parser')
const pretty = require('express-prettify')
const process = require('process')
const cors = require('cors')

const api = require('./routes/api')

const graphQLHttp = require("express-graphql")
const graphql =require("graphql")

const schemaTypes = require("./graphql/Types")
const rootValues =require("./graphql/Resolvers")

const schema = graphql.buildSchema(schemaTypes);


// configure it to use bodyparser
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '40mb', extended: true }))
app.use(bodyParser.json({ limit: '40mb', extended: true }))
app.use(pretty({ query: 'pretty' })) // in the query string use "pretty" to pretty print json
app.use(cors())

//port to use. this should be a env var or an argument when starting the app
const PORT = 8080

// ROUTE--------------------------------
app.use('/api', api)
app.use('/graphql',graphQLHttp({
  schema:schema,
  rootValue:rootValues,
  graphiql:true
}))
app.listen(PORT, async () => console.log(`pid ${process.pid}: rest api listening on port ${PORT}!`))
