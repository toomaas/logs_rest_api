const axios = require('axios')
const fs = require('fs')

module.exports.post = async function (req, res) {
  let data = req.body
  let url = 'http://10.11.112.38:5000'
  let config = {
    headers: {
      'Content-Type': 'application/json'
    },
    maxContentLength: 31457280 // maxlength 30 mb
  }
  let stream = fs.createWriteStream('axios_logs.txt', { flags: 'a' })
  try {
    let result = axios.post(url, data, config)
    res.send('ok')
    stream.write(`${new Date().toISOString()} ${result.data}\n`)
  } catch (error) {
    res.send('error')
    stream.write(`${new Date().toISOString()} error\n`)
  }
}