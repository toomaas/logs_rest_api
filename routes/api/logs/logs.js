var axios = require('axios');
const fs = require('fs');

module.exports.post = async function (req, res) {
  let data = req.body;
  let url = 'http://10.11.112.38:5000';
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
    maxContentLength: 31457280    //maxlength 30 mb
  };

  try {
    console.log("json size: " + data.length);
    let result = await axios.post(url, data, config);
    res.send(result.data);
  } catch (error) {
    fs.writeFile("aixos_error.txt", error, (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;
      // success case, the file was saved
      console.log('file saved!');
    });
  }
};