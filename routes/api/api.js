const express = require('express')
const logs = require('./logs/logs')
const alerting = require('./alerting/index')

const router = express.Router() // get an instance of the express Router
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

router.route('/logs')
// create a log (accessed at POST http://localhost:8080/api/logs)
  .post(async (req, res) =>{
    logs.post(req, res)
  })

  router.use('/alerting', alerting)

module.exports = router
