const express = require('express')
const logs = require('./logs')


const router = express.Router() // get an instance of the express Router
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

// middleware (always goes through here)
router.use(async function timeLog (req, res, next) {
  console.log('pid:', process.pid, 'Request made:', req.method, req.url, 'from', req.ip, 'Time:', Date.now())
  next()
})

    
router.use('/logs', logs)

module.exports = router
