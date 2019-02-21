const express = require('express')
const app_code = require('./app_code')

const router = express.Router() // get an instance of the express Router
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

router.route('/apps',)
  .get(async (req, res) => {
    app_code.get(req, res)
  })

module.exports = router

