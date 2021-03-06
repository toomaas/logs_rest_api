const express = require('express')
const logs = require('./logs')

const router = express.Router() // get an instance of the express Router
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

// middleware (always goes through here)
router.use(async function timeLog (req, res, next) {
  console.log('pid:', process.pid, 'Request info:', req.method, req.url, 'from:', req.ip, 'Time:', Date.now())
  next()
})

// using the router for all endpoints with /api/logs/....
router.use('/logs', logs)

module.exports = router
