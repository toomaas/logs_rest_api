const express = require('express')
const app_codes = require('./app_code')
const emails_per_app = require('./emails_per_app')
const alerting = require('./alerting')

const router = express.Router() // get an instance of the express Router
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get


router.route('/app_codes')
  .get(async (req, res) => {
    app_codes.get(req, res)
  })

router.route('/')
  .get(async (req, res) => {
    alerting.get(req, res)
  })
  .post(async (req, res) => {
    alerting.post(req, res)
  })
  .delete(async (req, res) => {
    alerting.delete(req, res)
  })

router.route('/app_emails/:app_code')
  .get(async (req, res) => {
    emails_per_app.get(req, res)
  })

module.exports = router

