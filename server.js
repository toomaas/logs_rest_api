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

//port to use. this should be a env var or an argument when starting the app
const PORT = 8080

//using the router to better understand the rest api structure 
var router = express.Router()

// middleware (always goes through here)
router.use(async function timeLog (req, res, next) {
  console.log('pid:', process.pid, 'Request:', req.method, req.url, 'from', req.ip, 'Time:', Date.now())
  next()
})

// <IP>:<PORT>/dashboard
router.get('/dashboard', async (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html')
})

// <IP>:<PORT>/api
router.use('/api', api)

// ROUTE--------------------------------
app.use('/', router)

app.listen(PORT, async () => console.log(`pid ${process.pid}: rest api listening on port ${PORT}!`))
