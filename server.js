const express = require('express')
const app = express() // define app using express
const bodyParser = require('body-parser')
const pretty = require('express-prettify')
const process = require('process')

const api = require('./routes/api/api')

// configure it to use bodyparser
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '40mb', extended: true }))
app.use(bodyParser.json({ limit: '40mb', extended: true }))
app.use(pretty({ query: 'pretty' })) // in the query string use "pretty" to pretty print json

const PORT = 8080

var router = express.Router()

// middleware (always goes through here)
router.use(function timeLog (req, res, next) {
  console.log('pid:', process.pid, 'Request:', req.method, req.url, 'from', req.ip, 'Time:', Date.now())
  next()
})

// :PORT/dashboard
router.get('/dashboard', function (req, res) {
  res.sendFile(__dirname + '/views/dashboard.html')
})

// :PORT/api
router.use('/api', api)

// ROUTE--------------------------------
app.use('/', router)

app.listen(PORT, () => console.log(`pid ${process.pid}: rest api listening on port ${PORT}!`))
