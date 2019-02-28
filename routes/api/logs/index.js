const express = require('express')
const router = express.Router() // get an instance of the express Router
const axios = require('axios')
const fs = require('fs')

router.route('/:source_system/:app_code').get(async (req, res) => {
    res.send(req.body.params)
})
//   .post(async (req, res) => {
//     alerting.post(req, res)
//   })
//   .delete(async (req, res) => {
//     alerting.delete(req, res)
//   })

module.exports = router